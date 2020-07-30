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

interface IRunnerContext {
  sites: Map<string, GatsbySite>
  addSite?: (site: GatsbySite) => void
  removeSite?: (site: GatsbySite) => void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const RunnerContext = createContext<IRunnerContext>({ sites: new Map() })

export function RunnerProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [sites, setSites] = useState(new Map<string, GatsbySite>())
  const addSite = useCallback(
    (site: GatsbySite) => {
      sites.set(site.root, site)
      setSites(sites)
    },
    [sites]
  )

  const removeSite = useCallback(
    (site: GatsbySite) => {
      sites.delete(site.root)
      setSites(sites)
    },
    [sites]
  )

  return (
    <RunnerContext.Provider value={{ sites, addSite, removeSite }}>
      {children}
    </RunnerContext.Provider>
  )
}

export function useSiteRunners(): {
  sites: Map<string, GatsbySite>
  addSite: (path: string) => GatsbySite | undefined
} {
  const { sites, addSite: addSiteToContext } = useContext(RunnerContext)

  const addSite = useCallback(
    (root: string): GatsbySite | undefined => {
      if (sites?.has(root)) {
        console.log(`got one`)
        return sites.get(root)
      }
      const site = new GatsbySite(root)
      addSiteToContext?.(site)
      return site
    },
    [sites]
  )

  return { sites, addSite }
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
