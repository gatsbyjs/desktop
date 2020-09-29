/** @jsx jsx */
import { jsx } from "theme-ui"
import { Modal, ModalPanel } from "gatsby-interface"
import { useCallback, Fragment, useState } from "react"
import { Status } from "../../controllers/site"
import { LogsViewer } from "./logs-viewer"
import { isErrored } from "../../util/site-status"
import { GhostButton } from "./ghost-button"
import { SiteStatusDot } from "../site-status-dot"
import { LogObject } from "../../util/ipc-types"
import { trackEvent } from "../../util/telemetry"

export interface IProps {
  structuredLogs: Array<LogObject>
  logs: Array<string>
  status: Status
  siteName: string
  siteHash?: string
}

export function LogsLauncher({
  structuredLogs,
  logs,
  status,
  siteName,
  siteHash,
}: IProps): JSX.Element {
  const error = isErrored(status)
  const [isOpen, setIsOpen] = useState(false)
  const toggleLogs = useCallback((): void => {
    setIsOpen((open) => {
      if (!open) {
        trackEvent(`OPEN_LOGS`, { siteHash })
      }
      return !open
    })
  }, [setIsOpen, siteHash])
  return (
    <Fragment>
      <GhostButton onClick={toggleLogs} size="S">
        {error && <SiteStatusDot status={status} mr={2} />}
        View logs
      </GhostButton>
      <Modal aria-label="Logs" isOpen={isOpen} onDismiss={toggleLogs}>
        <ModalPanel css={{ width: `52rem` }} maxWidth="80%">
          <LogsViewer
            structuredLogs={structuredLogs}
            logs={logs}
            siteName={siteName}
            onDismiss={toggleLogs}
          />
        </ModalPanel>
      </Modal>
    </Fragment>
  )
}
