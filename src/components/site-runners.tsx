import React, {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react"
import { GatsbySite, ISiteInfo, ISiteStatus } from "../controllers/site"

/**
 * This module uses shared context to store the list of user sites.
 */

interface IRunnerContext {
  sites: Map<string, GatsbySite>
  addSite?: (site: GatsbySite) => void
  removeSite?: (site: GatsbySite) => void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const RunnerContext = createContext<IRunnerContext>({ sites: new Map() })
/**
 * Wraps the site root element in gatsby-browser
 */
export function RunnerProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [sites, setSites] = useState(new Map<string, GatsbySite>())
  const addSite = useCallback(
    (site: GatsbySite) => {
      sites.set(site.root, site)
      setSites(new Map(sites))
    },
    [sites]
  )

  const removeSite = useCallback(
    (site: GatsbySite) => {
      sites.delete(site.root)
      setSites(new Map(sites))
    },
    [sites]
  )

  return (
    <RunnerContext.Provider value={{ sites, addSite, removeSite }}>
      {children}
    </RunnerContext.Provider>
  )
}

/**
 * Handles the list of sites, and functions to add and remove them
 */
export function useSiteRunners(): {
  sites: Map<string, GatsbySite>
  addSite: (siteInfo: ISiteInfo) => GatsbySite | undefined
} {
  const { sites, addSite: addSiteToContext } = useContext(RunnerContext)

  const addSite = useCallback(
    (siteInfo: ISiteInfo): GatsbySite | undefined => {
      if (sites?.has(siteInfo.path)) {
        return sites.get(siteInfo.path)
      }
      const site = new GatsbySite(siteInfo)
      addSiteToContext?.(site)
      return site
    },
    [sites, addSiteToContext]
  )
  return { sites, addSite }
}

/**
 * Gets the status of an individual site
 */
export function useSiteRunnerStatus(theSite: GatsbySite): ISiteStatus {
  const [status, setStatus] = useState<ISiteStatus>(theSite.siteStatus)
  console.log({ status })
  const update = useCallback((status: ISiteStatus): void => {
    setStatus(status)
  }, [])

  useEffect(() => {
    theSite?.onMessage(update)
    setStatus(theSite.siteStatus)
    return (): void => theSite?.offMessage(update)
  }, [theSite])

  return status
}
