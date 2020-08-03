/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { useSiteRunners } from "../components/site-runners"
import { SitePreview } from "../components/site-preview"
import { SiteBrowser } from "../components/site-browser"
import { useMemo } from "react"
import { EmptyState, Text } from "gatsby-interface"
import { useCallback } from "react"

export default function App(): JSX.Element {
  const { addSite, sites } = useSiteRunners()
  const siteList = useMemo(() => [...sites.values()], [sites])

  const showAlert = useCallback((msg?: string) => {
    window?.alert(msg)
  }, [])

  const addSiteButton = (
    <SiteBrowser onSelectSite={addSite} onSiteError={showAlert}>
      Add site
    </SiteBrowser>
  )

  return (
    <Flex m={4} css={{ flexDirection: `column` }}>
      <Flex css={{ justifyContent: `space-between` }}>
        <Text as={`span`}>Icon goes here</Text>
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
