/** @jsx jsx */
import { jsx } from "theme-ui"
import { useSiteRunners } from "../components/site-runners"
import { SitePreview } from "../components/site-preview"
import { SiteBrowser } from "../components/site-browser"
import { useMemo } from "react"
import { Flex } from "strict-ui"
import { EmptyState } from "gatsby-interface"

export default function App(): JSX.Element {
  const { addSite, sites } = useSiteRunners()
  const siteList = useMemo(() => [...sites.values()], [sites])

  const addSiteButton = (
    <SiteBrowser onSelectSite={addSite} onSiteError={alert}>
      Add site
    </SiteBrowser>
  )

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="row">
        <span>Icon goes here</span>
        {!!siteList.length && addSiteButton}
      </Flex>
      {siteList.length ? (
        siteList.map((site) => <SitePreview key={site.root} site={site} />)
      ) : (
        <EmptyState
          variant="BORDERED"
          heading=""
          text="There’s nothing to see here 🤔"
          primaryAction={addSiteButton}
        />
      )}
    </Flex>
  )
}
