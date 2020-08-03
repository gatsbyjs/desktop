/** @jsx jsx */
import { jsx, Flex } from "theme-ui"

export function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <Flex m={4} css={{ flexDirection: `column` }}>
      {children}
    </Flex>
  )
}
