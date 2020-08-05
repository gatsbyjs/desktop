/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { useSiteRunners } from "../components/site-runners"
import { SitePreview } from "../components/site-preview"
import { SiteBrowser } from "../components/site-browser"
import { useMemo } from "react"
import { EmptyState } from "gatsby-interface"
import { useCallback } from "react"
import { Layout } from "../components/layout"
import { SettingsMenu } from "../components/settings-menu"

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
    <Layout>
      <Flex
        sx={{
          justifyContent: `space-between`,
          alignItems: `center`,
          paddingBottom: 4,
        }}
      >
        <img src={require(`../../assets/logo.svg`)} alt="Gatsby" />
        {!!siteList.length && addSiteButton}
        <SettingsMenu />
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
    </Layout>
  )
}
