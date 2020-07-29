import React, { useCallback, useState } from "react"
import { useSiteRunners, RunnerProvider } from "../components/site-runners"
import { GatsbySite } from "../controllers/site"
import { SitePreview } from "../components/site-preview"

const root = `/Users/matt/Repos/trexible`

export default function App(): JSX.Element {
  console.log(`GATSBY!`)

  const { launchSite, sites } = useSiteRunners()

  const [site, setSite] = useState<GatsbySite>()

  const { logs, status } = site ?? { logs: [], status: `Loading` }
  console.log({ logs, status })
  const launch = useCallback(() => {
    const newSite = launchSite(root)
    console.log({ newSite })
    setSite(newSite)
  }, [setSite])

  const stop = useCallback(() => {
    console.log(`stoppping`, site)
    site?.stop()
  }, [site])

  return (
    <RunnerProvider>
      <div>
        <h1>💜 OMG Gatsby! 💜</h1>
        {site ? (
          <button onClick={stop}>Stop</button>
        ) : (
          <button onClick={launch}>Launch</button>
        )}

        {[...sites.values()].map((site) => (
          <SitePreview key={site.root} site={site} />
        ))}
      </div>
    </RunnerProvider>
  )
}
