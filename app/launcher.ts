/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/naming-convention */
import { IProgram } from "gatsby/internal"
import { readJSON } from "fs-extra"
import {
  fork,
  ChildProcessPromise as ChildProcess,
  Output,
} from "promisify-child-process"
import type { PackageJson } from "gatsby"
import path from "path"
import detectPort from "detect-port"
import fixPath from "fix-path"
import {
  LogObject,
  StructuredEventType,
  GlobalStatus,
  Status,
  IPCMessageType,
  IPCMessage,
} from "./ipc-types"

fixPath()

// Gatsby package type is missing these
type PackageJsonWithBin = PackageJson & { bin: { gatsby: string } }

async function getPackageJson(root: string): Promise<PackageJsonWithBin> {
  return readJSON(`${root}/node_modules/gatsby/package.json`)
}

async function isGatsbySite(root: string): Promise<boolean> {
  try {
    const packageJson = await getPackageJson(root)
    return packageJson?.name === `gatsby`
  } catch (e) {
    console.warn({ e })
    return false
  }
}

interface IAction {
  type: string
  payload: unknown
}

export interface Message {
  type: "message" | "error"
  message: unknown
}

export class SiteLauncher {
  public status: Status = GlobalStatus.NotStarted
  public logs: Array<LogObject> = []
  public rawLogs: Array<string> = []

  private proc: ChildProcess | undefined
  private listener?: (event: Message) => void

  private logAction = (action: IAction): void => {
    if (action.type === StructuredEventType.Log) {
      this.logs.push(action.payload as LogObject)
    }
    if (action.type === StructuredEventType.SetStatus) {
      console.log(`set status`, action.payload)
      this.status = action.payload as Status
    }
    this.postMessage({
      type: `message`,
      message: { type: `LOG_ACTION`, action },
    })
  }

  private handleExit = (code: number | null): void => {
    this.logAction({ type: `EXIT`, payload: code || 0 })
  }

  private sendRawLog = (message: string): void => {
    this.rawLogs.push(message)
    this.logAction({ type: `RAW_LOG`, payload: message })
  }

  constructor(public root: string, public hash: string) {
    // https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties
  }

  public setListener(listener: (event: Message) => void): void {
    this.listener = listener
  }

  public removeListener(): void {
    this.listener = undefined
  }

  private postMessage(event: Message): void {
    this.listener?.(event)
  }

  private spawnProcess(
    command: string,
    args: Array<string> = [],
    env: Record<string, string> = {}
  ): ChildProcess {
    const proc = fork(command, args, {
      // The Gatsby process detects the IPC channel and uses it to send
      // structured logs
      stdio: [`pipe`, `pipe`, `pipe`, `ipc`],
      cwd: this.root,
      env: {
        ...process.env,
        FORCE_COLOR: `1`,
        ...env,
      },
    })

    proc.stderr?.setEncoding(`utf8`)
    proc.stdout?.setEncoding(`utf8`)

    proc.stderr?.on(`data`, this.sendRawLog)
    proc.stdout?.on(`data`, this.sendRawLog)

    proc.on(`message`, (message: IPCMessage) => {
      if (message.type === IPCMessageType.LogAction) {
        this.logAction(message.action as IAction)
      }
    })

    return proc
  }

  public async start(clean: boolean = false): Promise<number> {
    if (!(await isGatsbySite(this.root))) {
      this.postMessage({
        type: `error`,
        message: `${this.root} is not a Gatsby site`,
      })
      console.log(`Not a gatsby site`)
      return 0
    }
    console.log(`Is a gatsby site. Launching`)

    if (this.proc) {
      // We're restarting, so don't want to notify of exit
      this.proc.off(`exit`, this.handleExit)

      this.proc.kill()
      this.proc = undefined
    }

    this.logs = []
    this.rawLogs = []

    const port = await detectPort(8000)

    console.log(`Running on port ${port}`)

    this.logAction({ type: `SET_PORT`, payload: port })

    const packageJson = await getPackageJson(this.root)

    const bin = packageJson?.bin?.gatsby || `dist/bin/gatsby.js`

    const cmd = path.resolve(this.root, `node_modules`, `gatsby`, bin)

    // this.logAction({
    //   type: StructuredEventType.SetStatus,
    //   payload: GlobalStatus.InProgress,
    // })

    if (clean) {
      let result: Output | undefined
      try {
        result = await this.spawnProcess(cmd, [`clean`])
      } catch (err) {
        console.error(err)
      }
      if (!result || result.code !== 0) {
        this.postMessage({
          type: `error`,
          message: `Failed to clean site`,
        })
        return 0
      }
    }

    // Runs `gatsby develop` in the site root
    this.proc = this.spawnProcess(cmd, [`develop`, `--port=${port}`], {
      GATSBY_EXPERIMENTAL_ENABLE_ADMIN: `1`,
    })

    this.logAction({ type: `SET_PID`, payload: this.proc.pid })

    this.proc.on(`exit`, this.handleExit)

    return port
  }

  public stop(): void {
    if (this.proc?.connected) {
      this.proc.kill()
      this.proc = undefined
    } else {
      console.log(`Not running`)
    }
  }
}
