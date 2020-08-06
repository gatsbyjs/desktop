/**
 * Watches the Gatsby metadata files to find available sites
 */
import tmp from "tmp"
import path from "path"
import xdgBasedir from "xdg-basedir"
import fs from "fs-extra"
import chokidar from "chokidar"
import { debounce } from "./utils"

// TODO: move these to gatsby-core-utils

export interface ISiteMetadata {
  sitePath: string
  name?: string
  pid?: number
  lastRun?: number
}

export interface IServiceInfo {
  port?: number
  pid?: number
}

const configDir = path.join(
  xdgBasedir.config || tmp.fileSync().name,
  `gatsby`,
  `sites`
)

async function getSiteInfo(file: string): Promise<ISiteMetadata> {
  return fs.readJSON(path.join(configDir, file))
}

export function sortSites(
  sites: Map<string, ISiteMetadata>
): Array<ISiteMetadata> {
  return Array.from(sites.values()).sort(
    (siteA, siteB) => (siteB.lastRun || 0) - (siteA.lastRun || 0)
  )
}

let watcher: chokidar.FSWatcher

export async function watchSites(
  updateHandler: (siteList: Array<ISiteMetadata>) => void
): Promise<void> {
  const sites = new Map<string, ISiteMetadata>()
  const update = debounce(updateHandler, 500)
  // Just in case
  await stopWatching()
  watcher = chokidar.watch(`*/metadata.json`, { cwd: configDir })

  watcher.on(`add`, async (path) => {
    const json = await getSiteInfo(path)
    console.log(`added`, json)
    sites.set(path, json)
    update(sortSites(sites))
  })
  watcher.on(`change`, async (path) => {
    const json = await getSiteInfo(path)
    console.log(`changed`, json)
    sites.set(path, json)
    update(sortSites(sites))
  })

  watcher.on(`delete`, async (path) => {
    const json = await getSiteInfo(path)
    console.log(`deleted`, json)
    sites.delete(path)
    update(sortSites(sites))
  })
}

export function stopWatching(): Promise<void> {
  return watcher?.close()
}
