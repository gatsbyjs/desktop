/** @jsx jsx */
import { jsx } from "theme-ui"
import { Button, Modal, ModalPanel } from "gatsby-interface"
import { MdFeaturedPlayList, MdWarning } from "react-icons/md"
import { useCallback, Fragment, useState } from "react"
import { Status } from "../controllers/site"
import { GlobalStatus } from "../util/ipc-types"
import { LogsViewer } from "./logs-viewer"

const isError = (status: Status): boolean =>
  ([GlobalStatus.Failed, GlobalStatus.Interrupted] as Array<Status>).includes(
    status
  )

export interface IProps {
  logs: Array<string>
  status: Status
}

export function LogsLauncher({ logs, status }: IProps): JSX.Element {
  const error = isError(status)
  const [isOpen, setIsOpen] = useState(false)
  const toggleLogs = useCallback((): void => {
    setIsOpen((open) => !open)
  }, [setIsOpen])
  return (
    <Fragment>
      <Button
        onClick={toggleLogs}
        variant="GHOST"
        size="M"
        rightIcon={error ? <MdWarning /> : <MdFeaturedPlayList />}
        sx={{
          fontFamily: `sans`,
          color: error ? `warning` : `gatsby`,
          fontWeight: 600,
          fontSize: 0,
          paddingLeft: 0,
        }}
      >
        {error ? `View Errors` : `View logs`}
      </Button>
      <Modal isOpen={isOpen}>
        <ModalPanel position="right" sx={{ width: `100vw` }}>
          <LogsViewer logs={logs} onDismiss={toggleLogs} isOpen={isOpen} />
        </ModalPanel>
      </Modal>
    </Fragment>
  )
}
