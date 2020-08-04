import React, { useCallback } from "react"
import { ipcRenderer } from "electron"
import { ISiteInfo } from "../controllers/site"
import { Button, ButtonProps } from "gatsby-interface"

interface IProps extends ButtonProps {
  onSelectSite: (siteInfo: ISiteInfo) => void
  onSiteError: (message?: string) => void
}

interface ISiteError {
  error: string
}

export function SiteBrowser({
  onSelectSite,
  onSiteError,
  ...props
}: IProps): JSX.Element {
  const browse = useCallback(async () => {
    console.log(`browsing`)
    // Sends a message to the main process asking for a file dialog.
    // It also verifies that it's a Gatsby site before returning it.
    const result: ISiteInfo | ISiteError | undefined = await ipcRenderer.invoke(
      `browse-for-site`
    )
    if (!result) {
      return
    }
    if (`error` in result) {
      onSiteError(result.error)
      return
    }

    onSelectSite(result)
  }, [onSelectSite])

  return <Button size="S" textVariant="BRAND" onClick={browse} {...props} />
}
