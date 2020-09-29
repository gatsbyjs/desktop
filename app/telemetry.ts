import telemetry from "gatsby-telemetry"
import { app, ipcMain, IpcMainEvent } from "electron"
import { ITelemetryTagsPayload } from "gatsby-telemetry/lib/telemetry"

function trackFeatureIsUsed(event: IpcMainEvent, name: string): void {
  console.log(`track feature is used`, name)
  telemetry.trackFeatureIsUsed(name)
}

function trackEvent(
  event: IpcMainEvent,
  input: string | Array<string>,
  tags?: ITelemetryTagsPayload
): void {
  console.log(`track event`, input, tags)
  telemetry.trackCli(input, tags)
}

export function initializeTelemetry(): void {
  telemetry.setDefaultComponentId(`gatsby-desktop`)
  telemetry.setGatsbyCliVersion(app.getVersion())
  ipcMain.on(`telemetry-trackFeatureIsUsed`, trackFeatureIsUsed)
  ipcMain.on(`telemetry-trackEvent`, trackEvent)
}
