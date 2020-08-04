/** @jsx jsx */
import { jsx, Flex } from "theme-ui"

export function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return <Flex css={{ flexDirection: `column`, m: `1.25rem` }}>{children}</Flex>
}
