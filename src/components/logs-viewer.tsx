/** @jsx jsx */
import { jsx, Flex, Box } from "theme-ui"
import { Text, Button } from "gatsby-interface"
import { MdArrowBack } from "react-icons/md"
import AnsiParser from "ansi-to-html"
import { useMemo, useRef, useEffect } from "react"

export interface IProps {
  logs: Array<string>
  onDismiss: () => void
  isOpen: boolean
}

export function LogsViewer({ logs, onDismiss, isOpen }: IProps): JSX.Element {
  const scroller = useRef<HTMLDivElement>(null)

  const parser = useMemo(
    () =>
      new AnsiParser({
        stream: true,
      }),
    []
  )

  const top =
    (scroller.current?.scrollHeight || 0) -
    (scroller.current?.clientHeight || 0)

  useEffect(() => {
    if (!isOpen) {
      return
    }
    scroller.current?.scrollTo({
      top,
      behavior: `smooth`,
    })
  }, [logs, scroller, top, isOpen])

  return (
    <Flex
      sx={{
        p: 4,
        flexDirection: `column`,
        maxHeight: `100%`,
        width: `100%`,
      }}
    >
      <Box>
        <Button
          onClick={onDismiss}
          variant="GHOST"
          leftIcon={<MdArrowBack />}
          sx={{
            fontFamily: `sans`,
            color: `gatsby`,
            fontSize: 0,
            paddingLeft: 0,
          }}
        >
          Back to all sites
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          borderRadius: 3,
          background: `black`,
          overflowY: `scroll`,
          overflowX: `hidden`,
        }}
        ref={scroller}
      >
        <ul
          sx={{
            m: 0,
            p: 4,
            listStyle: `none`,
          }}
        >
          {logs?.map((item, idx) => (
            <li
              key={idx}
              sx={{
                fontFamily: `mono`,
                fontSize: 0,
                color: `code.text`,
                lineHeight: 2,
              }}
              // eslint-disable-next-line @typescript-eslint/naming-convention
              dangerouslySetInnerHTML={{ __html: parser.toHtml(item) }}
            />
          ))}
        </ul>
      </Box>
    </Flex>
  )
}
