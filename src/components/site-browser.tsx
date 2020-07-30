import React, { HTMLAttributes, useCallback } from "react"
import { ipcRenderer } from "electron"
interface IProps extends HTMLAttributes<HTMLButtonElement> {
  onSelect: () => void
}

export function SiteBrowser({ onSelect, ...props }: IProps): JSX.Element {
  const browse = useCallback(async () => {
    console.log(`browsing`)
    const result = await ipcRenderer.invoke(`browse-for-site`, {})
    console.log({ result })
  }, [onSelect])

  return <button onClick={browse} {...props} />
}
