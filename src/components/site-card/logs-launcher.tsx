/** @jsx jsx */
import { jsx } from "theme-ui"
import { Modal, ModalPanel } from "gatsby-interface"
import { useCallback, Fragment, useState } from "react"
import { Status } from "../../controllers/site"
import { LogsViewer } from "./logs-viewer"
import { isErrored } from "../../util/site-status"
import { GhostButton } from "./ghost-button"
import { SiteStatusDot } from "../site-status-dot"

export interface IProps {
  logs: Array<string>
  status: Status
}

export function LogsLauncher({ logs, status }: IProps): JSX.Element {
  const error = isErrored(status)
  const [isOpen, setIsOpen] = useState(false)
  const toggleLogs = useCallback((): void => {
    setIsOpen((open) => !open)
  }, [setIsOpen])
  return (
    <Fragment>
      <GhostButton onClick={toggleLogs} size="S">
        {error && <SiteStatusDot status={status} mr={2} />}
        View logs
      </GhostButton>
      <Modal aria-label="Logs" isOpen={isOpen} onDismiss={toggleLogs}>
        <ModalPanel>
          <LogsViewer logs={logs} onDismiss={toggleLogs} />
        </ModalPanel>
      </Modal>
    </Fragment>
  )
}
