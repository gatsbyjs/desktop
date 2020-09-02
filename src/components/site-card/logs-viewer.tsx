/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { RawLogs, StyledPanel, StyledPanelHeader } from "gatsby-interface"
import AnsiParser from "ansi-to-html"
import { useMemo } from "react"

export interface IProps {
  logs: Array<string>
  siteName: string
  onDismiss: () => void
}

export function LogsViewer({ logs, siteName, onDismiss }: IProps): JSX.Element {
  const parser = useMemo(
    () =>
      new AnsiParser({
        stream: true,
      }),
    []
  )

  return (
    <StyledPanel>
      <Flex sx={{ flexDirection: `column`, height: `100%` }}>
        <StyledPanelHeader onCloseButtonClick={onDismiss}>
          Logs for <strong sx={{ color: `blue.80` }}>{siteName}</strong>
        </StyledPanelHeader>
        <RawLogs
          logItems={logs.map((logEntry) => {
            return {
              message: (
                <span
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  dangerouslySetInnerHTML={{ __html: parser.toHtml(logEntry) }}
                />
              ),
            }
          })}
          aria-label="Logs"
          sx={{ flexGrow: 1 }}
        />
      </Flex>
    </StyledPanel>
  )
}
