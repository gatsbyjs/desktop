import type { IProgram } from "gatsby/internal"
import { Action, StructuredEventType } from "../util/ipc-types"
const workerUrl = require(`file-loader!../../lib/launcher.js`)

export class GatsbySite {
  runner?: Worker
  logs: Array<string> = []
  status?: string

  activities = new Map<string, any>()

  private _listeners = new Set<(action: Action, site: GatsbySite) => void>()

  constructor(public root: string) {}

  public start(): void {
    const program: Partial<IProgram> = {
      directory: this.root,
    }
    if (!program.directory) {
      console.error(`No valid directory`)
      return
    }

    const runner = new Worker(workerUrl)

    runner.postMessage({ type: `launch`, program })
    runner.onmessage = (e): void => {
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
