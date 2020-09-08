import telemetry from "gatsby-telemetry"
import { app } from "electron"

export function startListening(): void {
  telemetry.setDefaultComponentId(`gatsby-desktop`)
  telemetry.setGatsbyCliVersion(app.getVersion())
}
