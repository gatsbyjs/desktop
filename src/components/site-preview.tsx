import React, { PropsWithChildren } from "react"
import { GatsbySite } from "../controllers/site"
import { useSiteRunnerStatus } from "./site-runners"

interface IProps {
  site: GatsbySite
}

export function SitePreview({ site }: PropsWithChildren<IProps>): JSX.Element {
  const { logs, status } = useSiteRunnerStatus(site)
  return (
    <section>
      <p>Status: {status}</p>
      <ul>
        {logs?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
