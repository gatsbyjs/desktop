import React, { HTMLAttributes, useCallback } from "react"
import { ipcRenderer } from "electron"
import { ISiteInfo } from "../controllers/site"

interface IProps extends HTMLAttributes<HTMLButtonElement> {
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
    // Sends a essage to the main process asking for a file dialog.
    // It also verifies that it's a Gatsby site before returning it.
    const result: ISiteInfo | ISiteError | undefined = await ipcRenderer.invoke(
      `browse-for-site`,
      {}
    )
    if (!result) {
      return
    }
    if (`error` in result) {
      onSiteError(result.error)
      return
    }

    onSelectSite(result)

    console.log({ result })
  }, [onSelectSite])

  return <button onClick={browse} {...props} />
}
