/** @jsx jsx */
import { jsx } from "theme-ui"
import { RawLogs, StyledPanel, StyledPanelHeader } from "gatsby-interface"
import AnsiParser from "ansi-to-html"
import { useMemo } from "react"

export interface IProps {
  logs: Array<string>
  onDismiss: () => void
}

export function LogsViewer({ logs, onDismiss }: IProps): JSX.Element {
  const parser = useMemo(
    () =>
      new AnsiParser({
        stream: true,
      }),
    []
  )

  return (
    <StyledPanel>
      <StyledPanelHeader onCloseButtonClick={onDismiss}>Logs</StyledPanelHeader>
      <RawLogs
        // RawLogs expect "message" to be a string but in factthey also support elements
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
      />
    </StyledPanel>
  )
}
