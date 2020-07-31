import React, { PropsWithChildren, useCallback } from "react"
import { GatsbySite } from "../controllers/site"
import { useSiteRunnerStatus } from "./site-runners"

interface IProps {
  site: GatsbySite
}

/**
 * The item in the list of sites
 */

export function SitePreview({ site }: PropsWithChildren<IProps>): JSX.Element {
  const { logs, status } = useSiteRunnerStatus(site)

  const stop = useCallback(() => site?.stop(), [site])
  const start = useCallback(() => site?.start(), [site])

  return (
    <section>
      <p>{site?.packageJson?.name ?? `Unnamed site`}</p>
      <p>Status: {status}</p>
      {/* TODO: We can do this better by properly keeping track of running status */}
      {!status || [`STOPPED`, `FAILED`, `INTERRUPTED`].includes(status) ? (
        <button onClick={start}>Start</button>
      ) : (
        <button onClick={stop}>Stop</button>
      )}

      {!!logs?.length && (
        <details>
          <ul>
            {logs?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
