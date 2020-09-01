import type { IProgram } from "gatsby/internal"
import {
  Action,
  StructuredEventType,
  IPCMessageType,
  GlobalStatus,
  LogObject,
} from "../util/ipc-types"
import { PackageJson } from "gatsby"
import {
  createServiceLock,
  getService,
} from "gatsby-core-utils/dist/service-lock"

import { createContentDigest } from "gatsby-core-utils"

import { ipcRenderer } from "electron"

// TODO: move these to gatsby-core-utils

export interface ISiteMetadata {
  sitePath: string
  name?: string
  lastRun?: number
  pid?: number
  hash?: string
}

export interface IServiceInfo {
  port?: number
}

export interface ISiteInfo {
  path: string
  packageJson: PackageJson
  warning?: string
}

export enum WorkerStatus {
  runningInBackground = `RUNNING_IN_BACKGROUND`,
  stopped = `STOPPED`,
}

export interface IMessage {
  type: "message" | "error"
  message: any
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
  logs: Array<LogObject>
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
  siteStatus: ISiteStatus = DEFAULT_STATUS
  startedInDesktop?: boolean

  private _listeners = new Set<(status: ISiteStatus, action?: Action) => void>()

  constructor(
    public root: string,
    public name: string = `Unnamed site`,
    public hash: string = createContentDigest(root),
    saveMetadata = false
  ) {
    if (saveMetadata) {
      this.saveMetadataToServiceConfig()
    } else {
      this.loadFromServiceConfig()
    }
    ipcRenderer.on(`site-message`, (event, hash: string, message: IMessage) => {
      if (hash !== this.hash) {
        // Not for us
        return
      }
      if (
        message?.type === `message` &&
        message?.message?.type === IPCMessageType.LogAction
      ) {
        this.handleMessage(message?.message?.action)
      } else {
        console.log(`Message received from worker`, message)
      }
    })
  }

  /**
   * Spawns a Worker to run `gatsby develop` and sets up listeners to
   * receive logs
   */

  public start(clean: boolean = false): void {
    this.startedInDesktop = true
    this.updateLastRun()
    this.updateStatus({
      running: true,
      logs: [],
      rawLogs: [`Waiting for logs...`],
      activities: new Map<string, any>(),
      status: GlobalStatus.InProgress,
    })

    ipcRenderer.send(`launch-site`, { root: this.root, hash: this.hash, clean })
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
    const service = await getService<IServiceInfo>(this.root, `developproxy`)
    console.log({ service })
    if (service) {
      // Site is running
      const newStatus: Partial<ISiteStatus> = {
        running: true,
        port: service.port as number,
      }

      if (STOPPED_STATES.includes(this.siteStatus.status)) {
        newStatus.status = WorkerStatus.RunningInBackground
      }
      this.updateStatus(newStatus)
    } else {
      if (this.siteStatus.status === WorkerStatus.RunningInBackground) {
        this.updateStatus({ status: GlobalStatus.NotStarted, running: false })
      } else if (this.siteStatus.status === GlobalStatus.NotStarted) {
        this.updateStatus({ running: false })
      }
    }
  }

  public async saveMetadataToServiceConfig(): Promise<void> {
    const metadata = await getService<ISiteMetadata>(
      this.root,
      `metadata`,
      true
    )
    return createServiceLock(this.root, `metadata`, {
      name: this.name,
      sitePath: this.root,
      pid: this.siteStatus.pid,
      ...metadata,
      lastRun: Date.now(),
    }).then((unlock) => unlock?.())
  }

  public async updateLastRun(): Promise<void> {
    const metadata = await getService<ISiteMetadata>(
      this.root,
      `metadata`,
      true
    )
    return createServiceLock(this.root, `metadata`, {
      sitePath: this.root,
      ...metadata,
      lastRun: Date.now(),
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
    ipcRenderer.send(`stop-site`, { hash: this.hash, pid: this.siteStatus.pid })
    this.updateStatus({ status: WorkerStatus.Stopped, running: false })
  }

  logMessage(message: string): void {
    this.updateStatus({
      rawLogs: this.siteStatus.rawLogs.concat(message),
    })
  }

  /**
   * Handles structured logs from the site
   */

  handleMessage(action: Action | IWorkerAction): void {
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
        this.updateStatus({
          logs: this.siteStatus.logs.concat(action.payload),
        })

        break

      case WorkerActionType.exit:
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
        break

      case WorkerActionType.rawLog:
        this.logMessage(String(action.payload))
        break

      default:
        console.log(`Unknown action`, action.type)
    }
  }
}
