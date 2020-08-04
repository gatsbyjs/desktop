/** @jsx jsx */
import { jsx, Flex } from "theme-ui"

export function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <Flex m={6} css={{ flexDirection: `column` }}>
      {children}
    </Flex>
  )
}
