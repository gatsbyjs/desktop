/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Text, Button } from "gatsby-interface"
import { PropsWithChildren, useCallback } from "react"
import { GatsbySite, WorkerStatus, Status } from "../controllers/site"
import { useSiteRunnerStatus } from "./site-runners"
import { SiteName } from "./site-name"
import { FolderName } from "./folder-name"
import { GlobalStatus } from "../util/ipc-types"
import { SiteLauncher } from "./site-launcher"
import { EditorLauncher } from "./editor-launcher"

interface IProps {
  site: GatsbySite
}

function canBeKilled(status: Status, pid?: number): boolean {
  return status !== WorkerStatus.runningInBackground || !!pid
}

/**
 * The item in the list of sites
 */

export function SitePreview({ site }: PropsWithChildren<IProps>): JSX.Element {
  const { logs, status, running, port, pid } = useSiteRunnerStatus(site)

  const stop = useCallback(() => site?.stop(), [site])
  const start = useCallback(() => site?.start(), [site])

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
      <Flex css={{ justifyContent: `space-between` }}>
        <SiteName
          siteName={site?.packageJson?.name ?? `Unnamed site`}
          status={status}
        />
        {!running ? (
          <Button
            size="S"
            variant="SECONDARY"
            textVariant="BRAND"
            onClick={start}
          >
            Start
          </Button>
        ) : (
          canBeKilled(status, pid) && (
            <Button
              size="S"
              variant="SECONDARY"
              textVariant="BRAND"
              onClick={stop}
            >
              Stop
            </Button>
          )
        )}
      </Flex>
      <FolderName sitePath={site.root} />
      <Flex>
        <EditorLauncher path={site.root} editor="code" />
        {(status === GlobalStatus.Success ||
          status === WorkerStatus.runningInBackground) &&
          !!port && <SiteLauncher port={port} />}
      </Flex>
      {!!logs?.length && (
        <details>
          <ul>
            {logs?.map((item, idx) => (
              <li key={idx}>
                <Text as="span">{item}</Text>
              </li>
            ))}
          </ul>
        </details>
      )}
    </Flex>
  )
}
