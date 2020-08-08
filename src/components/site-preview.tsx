/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Text, Button, SplitButton, DropdownMenuItem } from "gatsby-interface"
import { PropsWithChildren, useCallback, Fragment } from "react"
import { GatsbySite, WorkerStatus, Status } from "../controllers/site"
import { useSiteRunnerStatus } from "./site-runners"
import { SiteName } from "./site-name"
import { FolderName } from "./folder-name"
import { GlobalStatus } from "../util/ipc-types"
import { SiteLauncher } from "./site-launcher"
import { EditorLauncher } from "./editor-launcher"
import { LogsLauncher } from "./logs-launcher"

interface IProps {
  site: GatsbySite
}

function canBeKilled(status: Status, pid?: number): boolean {
  return status !== WorkerStatus.runningInBackground || !!pid
}

function isRunning(status: Status): boolean {
  return (
    status === GlobalStatus.Success ||
    status === WorkerStatus.runningInBackground
  )
}

/**
 * The item in the list of sites
 */

export function SitePreview({ site }: PropsWithChildren<IProps>): JSX.Element {
  const { logs, status, running, port, pid, rawLogs } = useSiteRunnerStatus(
    site
  )

  const stop = useCallback(() => site?.stop(), [site])
  const start = useCallback(() => site?.start(), [site])

  function StartButton({ label }: { label: string }): JSX.Element {
    return (
      <SplitButton
        size="S"
        variant="SECONDARY"
        textVariant="BRAND"
        onClick={start}
        buttonLabel={label}
        dropdownButtonLabel="More options"
        sx={{ fontFamily: `sans`, fontSize: 0 }}
      >
        <DropdownMenuItem onSelect={(): void => console.log(`Clear`)}>
          <Text sx={{ fontFamily: `sans`, fontSize: 1 }} as="span">
            Clear Cache and Start
          </Text>
        </DropdownMenuItem>
      </SplitButton>
    )
  }

  return (
    <Flex
      as={`section`}
      sx={{
        border: `grey`,
        borderRadius: 2,
        flexDirection: `column`,
        marginBottom: 4,
        p: 4,
      }}
    >
      <Flex css={{ justifyContent: `space-between`, minHeight: `24px` }}>
        <SiteName siteName={site?.name ?? `Unnamed site`} status={status} />
        {!running ? (
          <StartButton label={`Start`} />
        ) : (
          canBeKilled(status, pid) && (
            <Fragment>
              <StartButton label={`Restart`} />
              <Button
                sx={{ fontFamily: `sans`, fontSize: 0 }}
                size="S"
                variant="SECONDARY"
                textVariant="BRAND"
                onClick={stop}
              >
                Stop
              </Button>
            </Fragment>
          )
        )}
      </Flex>
      <FolderName sitePath={site.root} />
      <Flex>
        <EditorLauncher path={site.root} editor="code" />
        {isRunning(status) && !!port && <SiteLauncher port={port} />}
        {!!rawLogs?.length && <LogsLauncher logs={rawLogs} status={status} />}
      </Flex>
    </Flex>
  )
}
