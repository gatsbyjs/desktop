import type { IProgram } from "gatsby/internal"
import {
  Action,
  StructuredEventType,
  IPCMessageType,
  GlobalStatus,
} from "../util/ipc-types"
import { PackageJson } from "gatsby"
import {
  createServiceLock,
  getService,
} from "gatsby-core-utils/dist/service-lock"
import { ipcRenderer } from "electron"

const workerUrl = `/launcher.js`

export interface ISiteInfo {
  path: string
  packageJson: PackageJson
  warning?: string
}

export enum WorkerStatus {
  runningInBackground = `RUNNING_IN_BACKGROUND`,
  stopped = `STOPPED`,
}

export type Status = GlobalStatus | WorkerStatus

export enum WorkerActionType {
  setPort = `SET_PORT`,
  exit = `EXIT`,
  setPid = `SET_PID`,
  rawLog = `RAW_LOG`,
}

export interface IWorkerAction {
  type: WorkerActionType
  payload: unknown
}

export interface ISiteStatus {
  logs: Array<string>
  rawLogs: Array<string>
  status: Status
  activities: Map<string, any>
  running: boolean
  port?: number
  pid?: number
}

const DEFAULT_STATUS: ISiteStatus = {
  logs: [],
  rawLogs: [],
  status: GlobalStatus.NotStarted,
  activities: new Map<string, any>(),
  running: false,
}

const STOPPED_STATES = [GlobalStatus.NotStarted, GlobalStatus.Failed, `STOPPED`]

/**
 * Represents a single user Gatsby site
 */
export class GatsbySite {
  runner?: Worker
  root: string
  packageJson: PackageJson
  siteStatus: ISiteStatus = DEFAULT_STATUS

  private _listeners = new Set<(status: ISiteStatus, action?: Action) => void>()

  constructor(siteInfo: ISiteInfo) {
    this.root = siteInfo.path
    this.packageJson = siteInfo.packageJson
    if (this.root) {
      this.loadFromServiceConfig()
      this.saveMetadataToServiceConfig()
    }
  }

  /**
   * Spawns a Worker to run `gateby develop` and sets up listeners to
   * receive logs
   */

  public start(): void {
    this.updateStatus({
      running: true,
      logs: [],
      activities: new Map<string, any>(),
      status: GlobalStatus.InProgress,
    })

    const program: Partial<IProgram> = {
      directory: this.root,
    }
    this.runner = new Worker(workerUrl)
    this.runner.onerror = (e): void => {
      this.logMessage(`Error: ${e.message}`)
    }
    this.runner.postMessage({ type: `launch`, program })
    this.runner.onmessage = (e): void => {
      console.log(`Message received from worker`, e.data)
      if (
        e.data?.type === `message` &&
        e.data?.message?.type === IPCMessageType.LogAction
      ) {
        this.handleMessage(e.data?.message?.action)
      }
    }
  }

  public updateStatus(newStatus: Partial<ISiteStatus>): void {
    this.siteStatus = {
      ...this.siteStatus,
      ...newStatus,
    }
    this.notifyListeners()
  }

  public notifyListeners(action?: Action): void {
    this._listeners.forEach((listener) => listener(this.siteStatus, action))
  }

  public async loadFromServiceConfig(): Promise<void> {
    const service = await getService(this.root, `developproxy`)
    console.log({ service })
    if (service) {
      const newStatus: Partial<ISiteStatus> = {
        running: true,
        port: service.port as number,
        pid: service.pid as number,
      }

      if (STOPPED_STATES.includes(this.siteStatus.status)) {
        newStatus.status = WorkerStatus.runningInBackground
      }
      this.updateStatus(newStatus)
    } else {
      if (this.siteStatus.status === GlobalStatus.NotStarted) {
        this.updateStatus({ running: false })
      }
    }
  }

  public async saveMetadataToServiceConfig(): Promise<void> {
    const metadata = getService(this.root, `metadata`, true)
    return createServiceLock(this.root, `metadata`, {
      name: this.packageJson.name,
      sitePath: this.root,
      ...metadata,
    }).then((unlock) => unlock?.())
  }

  public onMessage(
    handler: (status: ISiteStatus, action?: Action) => void
  ): void {
    this._listeners.add(handler)
  }

  public offMessage(
    handler: (status: ISiteStatus, action?: Action) => void
  ): void {
    this._listeners.delete(handler)
  }

  public stop(): void {
    if (!this.runner) {
      if (this.siteStatus?.pid) {
        process.kill(this.siteStatus?.pid)
        this.updateStatus({ status: WorkerStatus.stopped })
        return
      }
      console.log(`No runner`)
      return
    }
    this.runner.postMessage({ type: `stop` })
    this.runner = undefined
    this.updateStatus({ status: WorkerStatus.stopped })
  }

  logMessage(message: string): void {
    this.updateStatus({
      logs: this.siteStatus.logs.concat(message),
    })
  }

  /**
   * Handles structured logs from the site
   */

  handleMessage(action: Action | IWorkerAction): void {
    console.log(`LOG`, action)
    const { activities } = this.siteStatus

    switch (action.type) {
      case StructuredEventType.ActivityStart:
      case StructuredEventType.ActivityEnd:
      case StructuredEventType.ActivityUpdate:
        activities.set(action.payload.uuid, action.payload)
        this.updateStatus({ activities })
        break

      case StructuredEventType.SetStatus:
        this.updateStatus({ status: action.payload })
        if (
          this.siteStatus.status === GlobalStatus.Success ||
          this.siteStatus.status === GlobalStatus.Failed
        ) {
          // Gets the port
          this.loadFromServiceConfig()
        }
        break

      case StructuredEventType.Log:
        this.logMessage(action.payload.text)
        console.log(action.payload.text)
        break

      case WorkerActionType.exit:
        if (this.siteStatus.pid) {
          ipcRenderer.send(`remove-child-pid`, this.siteStatus.pid)
        }
        this.updateStatus({
          running: false,
          pid: undefined,
          status:
            // payload is exitCode
            action.payload !== 0
              ? GlobalStatus.Failed
              : GlobalStatus.NotStarted,
        })

        break

      case WorkerActionType.setPort:
        // payload is port
        this.updateStatus({ port: action.payload as number })
        break

      case WorkerActionType.setPid:
        // payload is pid
        this.updateStatus({ pid: action.payload as number })
        ipcRenderer.send(`add-child-pid`, action.payload)
        break

      case WorkerActionType.rawLog:
        this.updateStatus({
          rawLogs: this.siteStatus.rawLogs.concat(String(action.payload)),
        })
        break

      default:
        console.log(`Unknown action`, action.type)
    }
  }
}
