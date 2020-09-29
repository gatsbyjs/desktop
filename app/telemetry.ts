import {
  startBackgroundUpdate,
  trackCli,
  setDefaultComponentId,
  setGatsbyCliVersion,
  trackFeatureIsUsed,
} from "gatsby-telemetry"
import { app, ipcMain, IpcMainEvent } from "electron"
import { ITelemetryTagsPayload } from "gatsby-telemetry/lib/telemetry"
import Store from "electron-store"

interface IConfigType {
  telemetryOptIn: boolean
}

let telemetryEnabled = true

function telemetryTrackFeatureIsUsed(event: IpcMainEvent, name: string): void {
  console.log(`track feature is used`, name, { telemetryEnabled })
  if (telemetryEnabled) {
    trackFeatureIsUsed(name)
  }
}

function trackEvent(
  event: IpcMainEvent,
  input: string | Array<string>,
  tags?: ITelemetryTagsPayload
): void {
  console.log(`track event`, input, tags, { telemetryEnabled })
  if (telemetryEnabled) {
    trackCli(input, tags)
  }
}

export function initializeTelemetry(): void {
  setDefaultComponentId(`gatsby-desktop`)
  setGatsbyCliVersion(app.getVersion())
  startBackgroundUpdate()
  const store = new Store<IConfigType>()
  store.onDidChange(`telemetryOptIn`, (newValue?: boolean) => {
    telemetryEnabled = !!newValue
  })
  if (store.get(`telemetryOptIn`) === false) {
    console.log(`running with telemetry disabled`)
    trackCli(`RUNNING_WITH_TELEMETRY_DISABLED`)
  }
  ipcMain.on(`telemetry-trackFeatureIsUsed`, telemetryTrackFeatureIsUsed)
  ipcMain.on(`telemetry-trackEvent`, trackEvent)
}
