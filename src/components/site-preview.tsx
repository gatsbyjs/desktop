/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Text, Button } from "gatsby-interface"
import { PropsWithChildren, useCallback } from "react"
import { GatsbySite } from "../controllers/site"
import { useSiteRunnerStatus } from "./site-runners"

interface IProps {
  site: GatsbySite
}

/**
 * The item in the list of sites
 */

export function SitePreview({ site }: PropsWithChildren<IProps>): JSX.Element {
  const { logs, status, running, port } = useSiteRunnerStatus(site)

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
        <Text as={`span`} variant="EMPHASIZED">
          {site?.packageJson?.name ?? `Unnamed site`}
        </Text>
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
          <Button
            size="S"
            variant="SECONDARY"
            textVariant="BRAND"
            onClick={stop}
          >
            Stop
          </Button>
        )}
      </Flex>
      <Text>{status}</Text>
      <Text>
        {running ? `running` : `stopped`} :{port}
      </Text>
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
