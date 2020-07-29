import React, {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react"
import { GatsbySite } from "../controllers/site"
import { Action } from "../util/ipc-types"

// eslint-disable-next-line @typescript-eslint/naming-convention
const RunnerContext = createContext(new Map<string, GatsbySite>())

export function RunnerProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <RunnerContext.Provider value={new Map<string, GatsbySite>()}>
      {children}
    </RunnerContext.Provider>
  )
}

export function useSiteRunners(): {
  sites: Map<string, GatsbySite>
  launchSite: (path: string) => GatsbySite | undefined
  stopSite: (path: string) => void
} {
  const sites = useContext(RunnerContext)

  const launchSite = useCallback(
    (root: string): GatsbySite | undefined => {
      if (sites.has(root)) {
        console.log(`got one`)
        return sites.get(root)
      }
      const site = new GatsbySite(root)
      sites.set(root, site)
      site.start()
      return site
    },
    [sites]
  )

  const stopSite = useCallback(
    (site: string) => {
      sites.get(site)?.stop()
    },
    [sites]
  )

  return { sites, launchSite, stopSite }
}

export function useSiteRunnerStatus(
  theSite: GatsbySite
): { logs: Array<string>; status: string | undefined } {
  const [logs, setLogs] = useState<Array<string>>([])
  const [status, setStatus] = useState<string>()

  const update = useCallback((action: Action, site: GatsbySite): void => {
    setLogs(site.logs)
    setStatus(site.status)
  }, [])

  useEffect(() => {
    theSite?.onMessage(update)
    return (): void => theSite.offMessage(update)
  }, [])

  return { logs, status }
}
