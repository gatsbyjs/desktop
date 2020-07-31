import React from "react"
import { useSiteRunners } from "../components/site-runners"
import { SitePreview } from "../components/site-preview"
import { SiteBrowser } from "../components/site-browser"

export default function App(): JSX.Element {
  const { addSite, sites } = useSiteRunners()

  return (
    <div>
      <h1>💜 OMG Gatsby! 💜</h1>
      <SiteBrowser onSelectSite={addSite} onSiteError={alert}>
        Browse for a Gatsby site
      </SiteBrowser>
      {[...sites.values()].map((site) => (
        <SitePreview key={site.root} site={site} />
      ))}
    </div>
  )
}
