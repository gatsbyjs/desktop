import type { IProgram } from "gatsby/internal"
import { Action, StructuredEventType } from "../util/ipc-types"
import { PackageJson } from "gatsby"
const workerUrl = `/launcher.js`

export interface ISiteInfo {
  path: string
  packageJson: PackageJson
  warning?: string
}
export class GatsbySite {
  runner?: Worker
  logs: Array<string> = []
  status = `STOPPED`
  root: string
  packageJson: PackageJson
  activities = new Map<string, any>()
  port?: number

  private _listeners = new Set<(action: Action, site: GatsbySite) => void>()

  constructor(siteInfo: ISiteInfo) {
    this.root = siteInfo.path
    this.packageJson = siteInfo.packageJson
  }

  public start(): void {
    this.logs = []
    this.activities.clear()
    this.status = `STARTING`
    const program: Partial<IProgram> = {
      directory: this.root,
    }
    this.runner = new Worker(workerUrl)

    this.runner.postMessage({ type: `launch`, program })
    this.runner.onmessage = (e): void => {
      console.log(`Message received from worker`, e.data)
      if (e.data?.type === `message` && e.data?.message?.type == `LOG_ACTION`) {
        this.handleMessage(e.data?.message?.action)
        this._listeners.forEach((listener) =>
          listener(e.data?.message?.action, this)
        )
      }
    }
  }

  public onMessage(handler: (action: Action, site: GatsbySite) => void): void {
    this._listeners.add(handler)
  }

  public offMessage(handler: (action: Action, site: GatsbySite) => void): void {
    this._listeners.delete(handler)
  }

  public stop(): void {
    if (!this.runner) {
      console.log(`None`)
      return
    }
    this.runner.postMessage({ type: `stop` })
    this.runner = undefined
    this.status = `STOPPED`
  }

  handleMessage(action: Action): void {
    console.log(`LOG`, action)
    switch (action.type) {
      case StructuredEventType.ActivityStart:
      case StructuredEventType.ActivityEnd:
      case StructuredEventType.ActivityUpdate:
        this.activities.set(action.payload.uuid, action.payload)
        break

      case StructuredEventType.SetStatus:
        this.status = action.payload
        break

      case StructuredEventType.Log:
        this.logs = this.logs.concat(action.payload.text)
        console.log(action.payload.text)
    }
  }
}
