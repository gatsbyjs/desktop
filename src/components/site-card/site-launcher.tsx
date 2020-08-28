/** @jsx jsx */
import { jsx } from "theme-ui"
import { shell } from "electron"
import { useCallback } from "react"
import { GhostButton } from "./ghost-button"

export interface IProps {
  port: number
}

export function SiteLauncher({ port }: IProps): JSX.Element {
  const openUrl = useCallback((): void => {
    shell.openExternal(`http://localhost:${port}`)
  }, [])
  return (
    <GhostButton onClick={openUrl} size="S">
      localhost:{port}
    </GhostButton>
  )
}
