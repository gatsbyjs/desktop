/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Text } from "gatsby-interface"
import { useSiteRunnerStatus, useSiteForHash } from "../../util/site-runners"

import { TabNavigation } from "../../components/tab-navigation"

export interface IProps {
  params: {
    hash: string
  }
}

export default function SitePage({ params }: IProps): JSX.Element {
  const site = useSiteForHash(params.hash)

  if (!site) {
    return (
      <div>
        <TabNavigation /> <p>Not found</p>
      </div>
    )
  }
  const { running, port } = useSiteRunnerStatus(site)

  return (
    <Flex sx={{ flexDirection: `column`, height: `100vh` }}>
      <TabNavigation />
      {running && port ? (
        <iframe
          frameBorder={0}
          src={`http://localhost:${port}/___admin`}
          sx={{
            flex: 1,
          }}
          onError={(): void => console.error(`iframe error`)}
        />
      ) : (
        <Text>Not running</Text>
      )}
    </Flex>
  )
}
