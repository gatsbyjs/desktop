/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  useSiteRunnerStatus,
  useSiteForHash,
} from "../../components/site-runners"

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
    <div>
      <TabNavigation /> <p>Hi {site?.name}</p>
    </div>
  )
}
