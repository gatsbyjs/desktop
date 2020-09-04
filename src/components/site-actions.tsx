/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  Text,
  SplitButton,
  DropdownMenuItem,
  SplitButtonProps,
} from "gatsby-interface"
import { useCallback } from "react"
import { GatsbySite, WorkerStatus, Status } from "../controllers/site"
import { useSiteRunnerStatus } from "../util/site-runners"

interface IProps
  extends Omit<
    SplitButtonProps,
    "children" | "buttonLabel" | "dropdownButtonLabel"
  > {
  site: GatsbySite
}

export function SiteActions({ site, ...rest }: IProps): JSX.Element {
  const { status, running, pid } = useSiteRunnerStatus(site)

  const stop = useCallback(() => site?.stop(), [site])
  const start = useCallback(() => site?.start(), [site])
  const clean = useCallback(() => site?.start(true), [site])

  return (
    <SplitButton
      size="S"
      variant="SECONDARY"
      textVariant="BRAND"
      onClick={start}
      buttonLabel={running ? `Restart` : `Start`}
      dropdownButtonLabel="More site actions"
      sx={{ fontFamily: `sans` }}
      {...rest}
    >
      <DropdownMenuItem onSelect={clean}>
        <Text sx={{ fontFamily: `sans`, fontSize: 1 }} as="span">
          Clear Cache and {running ? `Restart` : `Start`}
        </Text>
      </DropdownMenuItem>
      {canBeKilled(status, pid) && (
        <DropdownMenuItem onSelect={stop}>
          <Text sx={{ fontFamily: `sans`, fontSize: 1 }} as="span">
            Stop
          </Text>
        </DropdownMenuItem>
      )}
    </SplitButton>
  )
}

function canBeKilled(status: Status, pid?: number): boolean {
  return status !== WorkerStatus.RunningInBackground || !!pid
}
