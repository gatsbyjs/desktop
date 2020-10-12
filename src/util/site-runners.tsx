import React, {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react"
import {
  GatsbySite,
  ISiteInfo,
  ISiteStatus,
  ISiteMetadata,
} from "../controllers/site"
import { ipcRenderer } from "electron"
import { useConfig } from "./use-config"
import { isDefined } from "./helpers"

/**
 * This module uses shared context to store the list of user sites.
 */

interface IRunnerContext {
  sites: Array<GatsbySite>
  addSite?: (site: ISiteInfo) => GatsbySite
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const RunnerContext = createContext<IRunnerContext>({ sites: [] })
/**
 * Wraps the site root element in gatsby-browser
 */
export function RunnerProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  // This is the master site list. We don't share it directly, but instead
  // share an array sorted by last run. It may contain sites that are not
  // in the array (so not on disk), but that's ok because we don't display them
  const sitesMap = useMemo(() => new Map<string, GatsbySite>(), [])

  const [sites, setSites] = useState<Array<GatsbySite>>([])

  // Adds a new site. It doesn't add it directly to the list, but writes the metadata
  // which will in turn trigger an update to the list
  const addSite = useCallback(
    (siteInfo: ISiteInfo) => {
      const existingSite = sitesMap.get(siteInfo.path)
      if (existingSite) {
        // We've already got it in the list, but let's update the last run so it goes
        // to the top of the list
        existingSite.updateLastRun()
        return existingSite
      }
      const site = new GatsbySite(
        siteInfo.path,
        siteInfo.packageJson.name,
        undefined,
        true
      )
      sitesMap.set(site.root, site)
      return site
    },
    [sites]
  )

  // Called by the main process when the site list is updated by the watcher

  const updateFromSiteList = useCallback(
    async (
      event: Electron.IpcRendererEvent | undefined,
      siteList: Array<{
        site: ISiteMetadata
        status?: ISiteStatus & { startedInDesktop: boolean }
      }>
    ): Promise<void> => {
      console.log(`got new sites`, siteList)
      // Takes the sorted array of site metadata and converts
      // to a sorted array for `GatsbySite`s.
      const newSites = await Promise.all(
        siteList.map(async ({ site, status }) => {
          const existingSite = sitesMap.get(site.sitePath)
          if (existingSite) {
            console.log(`loading existing site service config`)
            existingSite.name = site.name || existingSite.name
            existingSite.startedInDesktop = status?.startedInDesktop
            existingSite.gatsbyVersion = site.gatsbyVersion
            existingSite.updateStatus({
              pid: site.pid,
            })
            await existingSite.loadFromServiceConfig()
            return existingSite
          }
          console.log(`loading new site`, site)
          const newSite = new GatsbySite(site.sitePath, site.name)
          newSite.gatsbyVersion = site.gatsbyVersion
          if (status) {
            newSite.updateStatus(status)
            newSite.startedInDesktop = status?.startedInDesktop
          }

          sitesMap.set(site.sitePath, newSite)
          return newSite
        })
      )
      setSites(newSites)
    },
    []
  )

  useEffect(() => {
    async function getSites(): Promise<void> {
      const siteList = await ipcRenderer.invoke(`get-sites`)
      updateFromSiteList(undefined, siteList)
    }
    getSites()
    ipcRenderer.on(`sites-updated`, updateFromSiteList)
    return (): void => {
      ipcRenderer.off(`sites-updated`, updateFromSiteList)
    }
  }, [])

  return (
    <RunnerContext.Provider value={{ sites, addSite }}>
      {children}
    </RunnerContext.Provider>
  )
}

/**
 * Handles the list of sites, and functions to add and remove them.
 */

export function useSiteRunners(): {
  // An array of sites, sorted in reverse order by last launched
  sites: Array<GatsbySite>
  // Excludes hidden sites
  filteredSites: Array<GatsbySite>
  addSite?: (siteInfo: ISiteInfo) => GatsbySite | undefined
} {
  const { sites, addSite } = useContext(RunnerContext)
  const [hiddenSites] = useConfig(`hiddenSites`)
  const filteredSites = sites.filter(
    (site) => !hiddenSites?.includes(site.hash)
  )

  return { sites, addSite, filteredSites }
}

/**
 * Gets a single site by hash
 */

export function useSiteForHash(hash: string): GatsbySite | undefined {
  const { sites } = useSiteRunners()
  return sites.find((site) => site.hash === hash)
}

/**
 * Handles the list of hidden sites
 */

export function useHiddenSites(): {
  hiddenSites: Array<string>
  hideSite: (siteHash: string) => void
  unhideSite: (siteHash: string) => void
  setHiddenSites: (siteHashes: Array<string>) => void
} {
  const [hiddenSites = [], setHiddenSites] = useConfig(`hiddenSites`)

  const hideSite = (siteHash: string): void =>
    setHiddenSites(Array.from(new Set([...hiddenSites, siteHash])))

  const unhideSite = (siteHash: string): void =>
    setHiddenSites(hiddenSites.filter((site) => site !== siteHash))

  return { hiddenSites, hideSite, unhideSite, setHiddenSites }
}

/**
 * Handles the site tabs
 */

export function useSiteTabs(): {
  siteTabs: Array<GatsbySite>
  addTab: (siteHash: string) => void
  removeTab: (siteHash: string) => void
  setTabs: (siteHashes: Array<string>) => void
} {
  const [tabs = [], setTabs] = useConfig(`siteTabs`)
  const { sites } = useSiteRunners()

  // The config value is an array of site hashes. This finds the matching
  // sites from context and returns an array of these.
  const siteTabs: Array<GatsbySite> = tabs
    .map((tab) => sites.find((site) => site.hash === tab))
    .filter(isDefined)

  // Neither of these are the most efficient, but the array is always small
  const addTab = (siteHash: string): void => {
    const newTabs = Array.from(new Set([...tabs, siteHash]))
    console.log(`adding tab`, { tabs, siteHash, newTabs })
    setTabs(newTabs)
  }

  const removeTab = (siteHash: string): void =>
    setTabs(tabs.filter((tab) => tab !== siteHash))
  console.log({ siteTabs })
  return { siteTabs, addTab, removeTab, setTabs }
}

/**
 * Gets the status of an individual site
 */
export function useSiteRunnerStatus(theSite: GatsbySite): ISiteStatus {
  const [status, setStatus] = useState<ISiteStatus>(theSite.siteStatus)
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
