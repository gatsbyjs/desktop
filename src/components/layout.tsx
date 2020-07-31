/** @jsx jsx */
import { jsx } from "theme-ui"
import { Flex } from "strict-ui"

export function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <Flex flexDirection="column">
      <main>{children}</main>
    </Flex>
  )
}
