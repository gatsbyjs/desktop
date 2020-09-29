import { ITelemetryTagsPayload } from "gatsby-telemetry/lib/telemetry"
import { ipcRenderer } from "electron"

export function trackFeatureIsUsed(name: string): void {
  ipcRenderer.send(`telemetry-trackFeatureIsUsed`, name)
}

export function trackEvent(
  input: string | Array<string>,
  tags?: ITelemetryTagsPayload
): void {
  ipcRenderer.send(`telemetry-trackEvent`, input, tags)
}
