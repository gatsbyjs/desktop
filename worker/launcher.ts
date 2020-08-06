import { IProgram } from "gatsby/internal"
import fs from "fs"
import { fork, ChildProcess } from "child_process"
import type { PackageJson } from "gatsby"
import path from "path"
import detectPort from "detect-port"
import fixPath from "fix-path"

fixPath()

/**
 * This is a Worker, spawned by the main renderer process. There is one of these
 * spawned for each user site that we launch. It handles the actual long-runnning
 * `gatsby develop` process.
 */
interface ILaunchEventPayload {
  type: "launch"
  program: IProgram
}

interface IStopEvent {
  data: { type: "stop" }
}

interface ILaunchEvent extends MessageEvent {
  data: ILaunchEventPayload
}

type DevelopEvent = IStopEvent | ILaunchEvent

async function readJSON<T = unknown>(filePath: string): Promise<T> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, `utf8`, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
}

async function isGatsbySite(root: string): Promise<boolean> {
  try {
    const packageJson = await readJSON<PackageJson>(
      `/${root}/node_modules/gatsby/package.json`
    )
    return packageJson?.name === `gatsby`
  } catch (e) {
    console.warn({ e })
    return false
  }
}

let proc: ChildProcess | undefined

function handleExit(code: number | null): void {
  logAction({ type: `EXIT`, payload: code || 0 })
}

interface IAction {
  type: string
  payload: unknown
}

function logAction(action: IAction): void {
  postMessage({ type: `message`, message: { type: `LOG_ACTION`, action } })
}

function sendRawLog(message: string): void {
  logAction({ type: `RAW_LOG`, payload: message })
}

async function launchSite(program: IProgram): Promise<number> {
  if (!(await isGatsbySite(program.directory))) {
    postMessage({
      type: `error`,
      message: `${program.directory} is not a Gatsby site`,
    })
    console.log(`Not a gatsby site`)
    return 0
  }
  console.log(`Is a gatsby site. Launching`)

  if (proc) {
    // We're restarting, so don't want to notify of exit
    proc.off(`exit`, handleExit)

    proc.kill()
    proc = undefined
  }

  const port = await detectPort(8000)

  console.log(`Running on port ${port}`)

  logAction({ type: `SET_PORT`, payload: port })

  const cmd = path.join(program.directory, `node_modules`, `.bin`, `gatsby`)

  // Runs `gatsby develop` in the site root
  proc = fork(cmd, [`develop`, `--port=${port}`], {
    // The Gatsby process detects the IPC channel and uses it to send
    // structured logs
    stdio: [`pipe`, `pipe`, `pipe`, `ipc`],
    cwd: program.directory,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    env: { ...process.env, FORCE_COLOR: `1` },
  })

  logAction({ type: `SET_PID`, payload: proc.pid })

  proc.stderr?.setEncoding(`utf8`)
  proc.stdout?.setEncoding(`utf8`)

  proc.stderr?.on(`data`, sendRawLog)
  proc.stdout?.on(`data`, sendRawLog)

  proc.on(`message`, (message) => postMessage({ type: `message`, message }))

  proc.on(`exit`, handleExit)

  return port
}

// Messages from the parent renderer window
onmessage = async (message: DevelopEvent): Promise<void> => {
  console.log(`message`, message)
  const { data } = message
  switch (data?.type) {
    case `launch`:
      await launchSite(data.program)
      postMessage(`Hi`)
      break

    case `stop`:
      if (proc?.connected) {
        proc.kill()
        proc = undefined
      } else {
        console.log(`Not running`)
      }
  }
}
