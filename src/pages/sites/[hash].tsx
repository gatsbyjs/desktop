/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Text, EmptyState, Button } from "gatsby-interface"
import { useSiteRunnerStatus, useSiteForHash } from "../../util/site-runners"
import { Layout } from "../../components/layout"
import { SiteActions } from "../../components/site-actions"
import { GatsbySite } from "../../controllers/site"
import { GlobalStatus } from "../../util/ipc-types"
import { supportsAdmin } from "../../util/site-status"
import { useMemo } from "react"

export interface IProps {
  params: {
    hash: string
  }
}

export default function SitePage({ params }: IProps): JSX.Element {
  const site = useSiteForHash(params.hash)

  return (
    <Layout>
      <main sx={{ height: `100%` }}>
        {site ? <SiteDetails site={site} /> : <Text>Not found</Text>}
      </main>
    </Layout>
  )
}

function SiteDetails({ site }: { site: GatsbySite }): JSX.Element {
  const { running, port, status } = useSiteRunnerStatus(site)

  const version = site.gatsbyVersion

  const adminSupported = useMemo(() => version && supportsAdmin(version), [
    version,
  ])

  if (!adminSupported) {
    return (
      <Flex
        sx={{
          alignItems: `center`,
          justifyContent: `center`,
          width: `100%`,
          height: `100%`,
        }}
      >
        <EmptyState
          heading="Please upgrade Gatsby"
          text={`Your site's version of Gatsby does not support Gatsby Admin. Please upgrade to the latest version`}
        />
      </Flex>
    )
  }

  return (
    <Flex sx={{ height: `100%` }}>
      {running && status !== GlobalStatus.InProgress && port ? (
        <iframe
          frameBorder={0}
          src={`http://localhost:${port}/___admin/`}
          sx={{
            flex: 1,
          }}
        />
      ) : (
        <Flex
          sx={{
            alignItems: `center`,
            justifyContent: `center`,
            width: `100%`,
            height: `100%`,
          }}
        >
          <div sx={{ maxWidth: `20rem` }}>
            <EmptyState
              heading="This site is not running"
              text={`Please start the gatsby develop process in order to use Gatsby \u000A Admin for this site.`}
              primaryAction={
                status === GlobalStatus.InProgress ? (
                  <Button variant="PRIMARY" size="M" loading={true} />
                ) : (
                  <SiteActions site={site} variant="PRIMARY" size="M" />
                )
              }
            />
          </div>
        </Flex>
      )}
    </Flex>
  )
}
