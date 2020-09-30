/** @jsx jsx */
import { jsx } from "theme-ui"
import { shell } from "electron"
import { useCallback } from "react"
import { GhostButton } from "./ghost-button"
import { trackEvent } from "../../util/telemetry"

export interface IProps {
  port: number
  siteHash?: string
}

export function SiteLauncher({ port, siteHash }: IProps): JSX.Element {
  const openUrl = useCallback((): void => {
    trackEvent(`CLICK_TO_OPEN_SITE_IN_BROWSER`, { siteHash })
    shell.openExternal(`http://localhost:${port}`)
  }, [port, siteHash])
  return (
    <GhostButton onClick={openUrl} size="S">
      localhost:{port}
    </GhostButton>
  )
}
