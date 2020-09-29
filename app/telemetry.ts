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

let telemetryEnabled: boolean | undefined

export function telemetryTrackFeatureIsUsed(name: string): void {
  console.log(`track feature is used`, name, { telemetryEnabled })
  if (telemetryEnabled) {
    trackFeatureIsUsed(name)
  }
}

export function trackEvent(
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
  telemetryEnabled = store.get(`telemetryOptIn`)
  if (telemetryEnabled === false) {
    console.log(`running with telemetry disabled`)
    trackCli(`RUNNING_WITH_TELEMETRY_DISABLED`)
  } else {
    trackCli(`GATSBY_DESKTOP_STARTED`)
    console.log(`telemetry enabled or not chosen`, { telemetryEnabled })
  }
  ipcMain.on(
    `telemetry-trackFeatureIsUsed`,
    (event: IpcMainEvent, name: string): void =>
      telemetryTrackFeatureIsUsed(name)
  )
  ipcMain.on(
    `telemetry-trackEvent`,
    (
      event: IpcMainEvent,
      input: string | Array<string>,
      tags?: ITelemetryTagsPayload
    ): void => trackEvent(input, tags)
  )
}
