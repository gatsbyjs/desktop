import {
  startBackgroundUpdate,
  trackCli,
  setDefaultComponentId,
  setGatsbyCliVersion,
  trackFeatureIsUsed,
} from "gatsby-telemetry"
import { app, ipcMain, IpcMainEvent } from "electron"
import { ITelemetryTagsPayload } from "gatsby-telemetry/lib/telemetry"

function telemetryTrackFeatureIsUsed(event: IpcMainEvent, name: string): void {
  console.log(`track feature is used`, name)
  trackFeatureIsUsed(name)
}

function trackEvent(
  event: IpcMainEvent,
  input: string | Array<string>,
  tags?: ITelemetryTagsPayload
): void {
  console.log(`track event`, input, tags)
  trackCli(input, tags)
}

export function initializeTelemetry(): void {
  setDefaultComponentId(`gatsby-desktop`)
  setGatsbyCliVersion(app.getVersion())
  startBackgroundUpdate()
  ipcMain.on(`telemetry-trackFeatureIsUsed`, telemetryTrackFeatureIsUsed)
  ipcMain.on(`telemetry-trackEvent`, trackEvent)
}
