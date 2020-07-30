import { IProgram } from "gatsby/internal"
import fs from "fs"
import { spawn, ChildProcess } from "child_process"
import type { PackageJson } from "gatsby"
import path from "path"
import detectPort from "detect-port"
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
  console.log(`reading`, filePath)
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
    console.log({ packageJson })
    return packageJson.name === `gatsby`
  } catch (e) {
    console.log({ e })
    return false
  }
}

let proc: ChildProcess | undefined

async function launchSite(program: IProgram): Promise<void | ChildProcess> {
  if (!(await isGatsbySite(program.directory))) {
    postMessage({
      type: `error`,
      message: `${program.directory} is not a Gatsby site`,
    })
    console.log(`Not a gatsby site`)
    return void 0
  }
  console.log(`Is a gatsby site. Launching`)

  if (proc) {
    proc.kill()
    proc = undefined
  }

  const port = await detectPort(8000)

  console.log(`Running on port ${port}`)

  proc = spawn(
    path.join(program.directory, `node_modules`, `.bin`, `gatsby`),
    [`develop`, `--port=${port}`],
    {
      stdio: [`pipe`, `pipe`, `pipe`, `ipc`],
      cwd: program.directory,
    }
  )

  proc.stderr?.setEncoding(`utf8`)
  proc.stdout?.setEncoding(`utf8`)

  proc.stderr?.on(`data`, (data) => console.log(data))
  proc.stdout?.on(`data`, (data) => console.log(data))

  proc.on(`message`, (message) => postMessage({ type: `message`, message }))
  return proc
}

onmessage = async (message: DevelopEvent): Promise<void> => {
  console.log(`received`, message)
  const { data } = message
  switch (data?.type) {
    case `launch`:
      console.log(`launching`)
      await launchSite(data.program)
      postMessage(`Hi`)
      break

    case `stop`:
      proc?.kill()
  }
}
