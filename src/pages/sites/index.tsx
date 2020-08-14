/** @jsx jsx */
import { jsx } from "theme-ui"
import { useSiteRunners } from "../../components/site-runners"
import { SitePreview } from "../../components/site-preview"
import { SiteBrowser } from "../../components/site-browser"
import { TabNavigation } from "../../components/tab-navigation"

export default function MainPage(): JSX.Element {
  return (
    <div>
      <TabNavigation /> <p>Hi</p>
    </div>
  )
}
