/** @jsx jsx */
import { jsx } from "theme-ui"
import { Text } from "gatsby-interface"
import { Status, WorkerStatus } from "../controllers/site"
import { GlobalStatus } from "../util/ipc-types"
import { MdPlayArrow, MdStop, MdSchedule, MdWarning } from "react-icons/md"

export interface IProps {
  siteName: string
  status: Status
}

function getColorForStatus(status: Status, theme: Record<string, any>): string {
  switch (status) {
    case GlobalStatus.Success:
    case WorkerStatus.runningInBackground:
      return theme.tones.SUCCESS.dark

    case GlobalStatus.NotStarted:
    case WorkerStatus.stopped:
      return theme.tones.NEUTRAL.dark

    case GlobalStatus.InProgress:
      return theme.colors.grey[80]

    case GlobalStatus.Failed:
      return theme.tones.DANGER.dark

    default:
      return theme.tones.text.primary
  }
}

function StatusIcon({ status }: { status: Status }): JSX.Element {
  switch (status) {
    case GlobalStatus.Success:
    case WorkerStatus.runningInBackground:
      return <MdPlayArrow size={16} />

    case GlobalStatus.NotStarted:
    case WorkerStatus.stopped:
      return <MdStop size={16} />

    case GlobalStatus.InProgress:
      return <MdSchedule size={16} />

    case GlobalStatus.Failed:
      return <MdWarning size={16} />

    default:
      return <MdStop size={16} />
  }
}

export function SiteName({ siteName, status }: IProps): JSX.Element {
  return (
    <Text
      as="span"
      sx={(theme): Record<string, any> => {
        return {
          fontFamily: theme.fonts.sans,
          fontWeight: 600,
          fontSize: 1,
          color: getColorForStatus(status, theme),
          alignItems: `center`,
          display: `flex`,
        }
      }}
    >
      <StatusIcon status={status} />
      <span title={status} sx={{ lineHeight: `16px`, paddingLeft: 2 }}>
        {siteName}
      </span>
    </Text>
  )
}
