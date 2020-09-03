/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { keyframes } from "@emotion/core"
import { Text, SplitButton, DropdownMenuItem, ThemeCss } from "gatsby-interface"
import { PropsWithChildren, useCallback } from "react"
import { GatsbySite, WorkerStatus, Status } from "../../controllers/site"
import { useSiteRunnerStatus, useSiteTabs } from "../../util/site-runners"
import { FolderName } from "../folder-name"
import { SiteLauncher } from "./site-launcher"
import { EditorLauncher } from "./editor-launcher"
import { LogsLauncher } from "./logs-launcher"
import { MdArrowForward } from "react-icons/md"
import { navigate } from "gatsby"
import {
  getSiteDisplayStatus,
  SiteDisplayStatus,
  siteDisplayStatusLabels,
} from "../../util/site-status"
import { visuallyHiddenCss } from "../../util/a11y"
import { useConfig } from "../../util/use-config"

interface IProps {
  site: GatsbySite
}

function canBeKilled(status: Status, pid?: number): boolean {
  return status !== WorkerStatus.RunningInBackground || !!pid
}

/**
 * The item in the list of sites
 */
export function SiteCard({ site }: PropsWithChildren<IProps>): JSX.Element {
  const { status, running, port, pid, rawLogs, logs } = useSiteRunnerStatus(
    site
  )

  const { addTab } = useSiteTabs()

  const stop = useCallback(() => site?.stop(), [site])
  const start = useCallback(() => site?.start(), [site])
  const clean = useCallback(() => site?.start(true), [site])

  console.log(site.name, status)
  const displayStatus = getSiteDisplayStatus(status)

  const [editor] = useConfig(`preferredEditor`)

  return (
    <Flex
      as={`section`}
      sx={{
        border: `grey`,
        borderRadius: 2,
        boxShadow: `raised`,
        whiteSpace: `pre`,
      }}
    >
      <StatusIndicator displayStatus={displayStatus} />
      <Flex sx={{ p: 4, flexDirection: `column`, flex: 1 }}>
        <Flex
          css={{ justifyContent: `space-between`, minHeight: `24px` }}
          mb={5}
        >
          <span
            sx={{
              fontFamily: `sans`,
              fontWeight: 600,
              fontSize: 1,
              pr: 3,
            }}
          >
            {site.name ?? `Unnamed site`}
            <FolderName sitePath={site.root} />
          </span>
          <Flex sx={{ alignItems: `center` }}>
            <span css={visuallyHiddenCss}>
              Site status: {siteDisplayStatusLabels[displayStatus]}
            </span>
            <div sx={{ mr: 3 }}>
              {displayStatus === SiteDisplayStatus.Running && !!port ? (
                <SiteLauncher port={port} />
              ) : displayStatus === SiteDisplayStatus.Starting ? (
                <Text as="span" sx={{ fontSize: 0, color: `grey.60` }}>
                  Starting site...
                </Text>
              ) : null}
            </div>
            {!!rawLogs?.length && (
              <LogsLauncher
                structuredLogs={logs}
                logs={rawLogs}
                status={status}
                siteName={site.name}
              />
            )}
            <SplitButton
              size="S"
              variant="SECONDARY"
              textVariant="BRAND"
              onClick={start}
              buttonLabel={running ? `Restart` : `Start`}
              dropdownButtonLabel="More site actions"
              sx={{ fontFamily: `sans`, fontSize: 0 }}
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
          </Flex>
        </Flex>
        <Flex mt="auto">
          <EditorLauncher path={site.root} editor={editor} />
        </Flex>
      </Flex>
      <button
        sx={{
          display: `flex`,
          flexBasis: `32px`,
          alignItems: `center`,
          justifyContent: `center`,
          backgroundColor: `grey.10`,
          border: `none`,
          boxShadow: `-1px 0px 0px #D9D7E0`,
          cursor: `pointer`,
          color: `grey.50`,
          fontSize: 2,
        }}
        aria-label="Open site admin"
        onClick={(event): void => {
          event.stopPropagation()
          addTab(site.hash)
          navigate(`/sites/${site.hash}`)
        }}
      >
        <MdArrowForward />
      </button>
    </Flex>
  )
}

const statusAnimation = keyframes({
  "100%": { backgroundPosition: `100% 100%` },
})

const statusStartingCss: ThemeCss = (theme) => [
  {
    background: `repeating-linear-gradient(
      -30deg,
      ${theme.colors.purple[30]},
      ${theme.colors.purple[30]} 4px,
      ${theme.colors.purple[40]} 4px,
      ${theme.colors.purple[40]} 8px
    )`,
    backgroundSize: `200% 200%`,
    animation: `${statusAnimation} 10s infinite linear forwards`,
  },
]

const statusSuccessCss: ThemeCss = (theme) => [
  {
    background: theme.colors.green[40],
  },
]

const statusStoppedCss: ThemeCss = (theme) => [
  {
    background: theme.colors.grey[40],
  },
]

const statusErroredCss: ThemeCss = (theme) => [
  {
    background: theme.colors.orange[70],
  },
]

function StatusIndicator({
  displayStatus,
}: {
  displayStatus: SiteDisplayStatus
}): JSX.Element {
  const statusIndicatorCss: ThemeCss = (theme) => [
    {
      width: `6px`,
      borderTopLeftRadius: `inherit`,
      borderBottomLeftRadius: `inherit`,
    },
    displayStatus === SiteDisplayStatus.Stopped && statusStoppedCss(theme),
    displayStatus === SiteDisplayStatus.Starting && statusStartingCss(theme),
    displayStatus === SiteDisplayStatus.Running && statusSuccessCss(theme),
    displayStatus === SiteDisplayStatus.Errored && statusErroredCss(theme),
  ]

  return <div css={statusIndicatorCss} />
}
