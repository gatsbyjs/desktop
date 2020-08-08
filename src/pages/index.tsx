/** @jsx jsx */
import { jsx } from "theme-ui"
import { useSiteRunners } from "../components/site-runners"
import { SitePreview } from "../components/site-preview"
import { SiteBrowser } from "../components/site-browser"
import { EmptyState } from "gatsby-interface"
import { Layout } from "../components/layout"
import { remote } from "electron"

function showAlert(msg?: string): void {
  remote.dialog.showErrorBox(`Could not add site`, msg || `There was an error`)
}

export default function App(): JSX.Element {
  const { addSite, sites } = useSiteRunners()

  const addSiteButton = (
    <SiteBrowser onSelectSite={addSite} onSiteError={showAlert}>
      Add site
    </SiteBrowser>
  )

  return (
    <Layout headerItems={sites.length ? addSiteButton : null}>
      {sites.length ? (
        sites.map((site) => <SitePreview key={site.root} site={site} />)
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
