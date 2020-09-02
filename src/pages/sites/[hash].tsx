/** @jsx jsx */
import { jsx } from "theme-ui"
import { Text } from "gatsby-interface"
import { useSiteRunnerStatus, useSiteForHash } from "../../util/site-runners"
import { Layout } from "../../components/layout"

export interface IProps {
  params: {
    hash: string
  }
}

export default function SitePage({ params }: IProps): JSX.Element {
  const site = useSiteForHash(params.hash)

  if (!site) {
    return (
      <Layout>
        <main>
          <Text>Not found</Text>
        </main>
      </Layout>
    )
  }
  const { running, port } = useSiteRunnerStatus(site)

  return (
    <Layout>
      <main>
        {running && port ? (
          <iframe
            frameBorder={0}
            src={`http://localhost:${port}/___admin/`}
            sx={{
              flex: 1,
            }}
            onError={(): void => console.error(`iframe error`)}
          />
        ) : (
          <Text>Not running</Text>
        )}
      </main>
    </Layout>
  )
}
