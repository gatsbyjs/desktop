/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import {
  RawLogs,
  StyledPanel,
  StyledPanelHeader,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  BuildLogsList,
  BuildActivityType,
  BuildActivityStatus,
  StyledPanelBodySection,
  BuildLogItem,
} from "gatsby-interface"
import AnsiParser from "ansi-to-html"
import { useMemo } from "react"
import { LogObject, ActivityType, ActivityLogLevel } from "../../util/ipc-types"

export interface IProps {
  structuredLogs: Array<LogObject>
  logs: Array<string>
  siteName: string
  onDismiss: () => void
}

export function LogsViewer({
  structuredLogs,
  logs,
  siteName,
  onDismiss,
}: IProps): JSX.Element {
  const parser = useMemo(
    () =>
      new AnsiParser({
        stream: true,
      }),
    []
  )

  console.log(`structuredLogs`, structuredLogs)

  return (
    <StyledPanel>
      <Flex sx={{ flexDirection: `column`, height: `100%` }}>
        <StyledPanelHeader onCloseButtonClick={onDismiss}>
          <strong sx={{ color: `blue.80` }}>{siteName}</strong>
        </StyledPanelHeader>
        <Tabs sx={{ flexGrow: 1, display: `flex`, flexDirection: `column` }}>
          <TabList sx={{ flexGrow: 0 }}>
            <Tab>Logs</Tab>
            <Tab>Raw logs</Tab>
          </TabList>
          <TabPanels sx={{ flexGrow: 1 }}>
            <TabPanel sx={{ height: `100%` }}>
              <StyledPanelBodySection>
                <BuildLogsList
                  logItems={structuredLogs.map(logObjectToBuildLogItem)}
                  aria-label="Logs"
                  sx={{
                    fontFamily: `sans`,
                  }}
                />
              </StyledPanelBodySection>
            </TabPanel>
            <TabPanel sx={{ height: `100%` }}>
              <RawLogs
                logItems={logs.map((logEntry) => {
                  return {
                    message: (
                      <span
                        dangerouslySetInnerHTML={{
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          __html: parser.toHtml(logEntry),
                        }}
                      />
                    ),
                  }
                })}
                aria-label="Raw Logs"
                sx={{ height: `100%` }}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </StyledPanel>
  )
}

const mapActivityTypeToBuildActivityType: Record<
  ActivityType,
  BuildActivityType
> = {
  [ActivityType.spinner]: BuildActivityType.Spinner,
  [ActivityType.progress]: BuildActivityType.Progress,
  [ActivityType.pending]: BuildActivityType.Pending,
  [ActivityType.hidden]: BuildActivityType.Hidden,
}

const mapActivityLevelToBuildActivityStatus: Record<
  ActivityLogLevel,
  BuildActivityStatus
> = {
  [ActivityLogLevel.ActivityFailed]: BuildActivityStatus.Failed,
  [ActivityLogLevel.ActivityInterrupted]: BuildActivityStatus.Interrupted,
  [ActivityLogLevel.ActivitySuccess]: BuildActivityStatus.Success,
}

function logObjectToBuildLogItem(logObject: LogObject): BuildLogItem {
  // Handle activity
  if (`activity_uuid` in logObject) {
    return {
      id: logObject.activity_uuid,
      message: logObject.text.trim(),
      activity: {
        id: logObject.activity_uuid,
        type:
          mapActivityTypeToBuildActivityType[
            logObject.activity_type as ActivityType
          ],
        status: mapActivityLevelToBuildActivityStatus[logObject.level],
        name: logObject.text,
        duration: logObject.duration,
        current: logObject.activity_current,
        total: logObject.activity_total,
      },
    }
  }

  return {
    ...logObject,
    id: `${logObject.timestamp}-${logObject.text.substr(0, 12)}`,
    message: logObject.text.trim(),
  }
}
