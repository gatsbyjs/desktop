/** @jsx jsx */
import { jsx } from "theme-ui"
import { Button } from "gatsby-interface"
import { MdOpenInNew } from "react-icons/md"
import { shell } from "electron"
import { useCallback } from "react"

export interface IProps {
  port: number
}

export function SiteLauncher({ port }: IProps): JSX.Element {
  const openUrl = useCallback((): void => {
    shell.openExternal(`http://localhost:${port}`)
  }, [])
  return (
    <Button
      onClick={openUrl}
      variant="GHOST"
      size="M"
      rightIcon={<MdOpenInNew />}
      sx={{
        fontFamily: `sans`,
        color: `gatsby`,
        fontWeight: 600,
        fontSize: 0,
        paddingLeft: 0,
      }}
    >
      localhost:{port}
    </Button>
  )
}
