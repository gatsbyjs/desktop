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
  hash?: string
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

// Shallow merge of site metadata
async function mergeSiteInfo(
  file: string,
  info: Partial<ISiteMetadata>
): Promise<ISiteMetadata> {
  const current = await getSiteInfo(file)
  const newInfo = { ...current, ...info }
  await fs.writeJSON(path.join(configDir, file), newInfo)
  return newInfo
}

// Sort by last run
export function sortSites(
  sites: Map<string, ISiteMetadata>
): Array<ISiteMetadata> {
  return Array.from(sites.values()).sort(
    (siteA, siteB) => (siteB.lastRun || 0) - (siteA.lastRun || 0)
  )
}

export async function deleteSiteMetaData(metadataPath: string): Promise<void> {
  console.log(`delete`, metadataPath)
  await fs.unlink(path.join(configDir, metadataPath))
}

// Deletes metadata for missing sites
export async function cleanupDeletedSites(
  siteList: Map<string, ISiteMetadata>
): Promise<void> {
  await Promise.all(
    [...siteList.entries()].map(async ([metadataPath, site]) => {
      if (
        !site.sitePath ||
        !(await fs.pathExists(path.join(site.sitePath, `package.json`)))
      ) {
        console.log(`deleting`, metadataPath, site.sitePath)
        deleteSiteMetaData(metadataPath)
      }
    })
  )
}

let metadataWatcher: chokidar.FSWatcher
let siteWatcher: chokidar.FSWatcher
let lockWatcher: chokidar.FSWatcher

export async function watchSites(
  updateHandler: (siteList: Array<ISiteMetadata>) => void
): Promise<void> {
  const sites = new Map<string, ISiteMetadata>()
  const reverseLookup = new Map<string, string>()
  const notify = debounce(updateHandler, 500)
  const cleanup = debounce(cleanupDeletedSites, 10000)

  await stopWatching()

  metadataWatcher = chokidar.watch(`*/metadata.json`, { cwd: configDir })
  lockWatcher = chokidar.watch(`*/developproxy.json.lock`, { cwd: configDir })
  // This will watch sites' package.json files
  siteWatcher = chokidar.watch([])

  // Sends an update to the renderer
  function update(sites: Map<string, ISiteMetadata>): void {
    const siteArray = sortSites(sites)
    notify(siteArray)
    cleanup(sites)
  }

  siteWatcher.on(`unlink`, (pkgJsonPath) => {
    console.log(`site deleted`, path)
    const metadataPath = reverseLookup.get(pkgJsonPath)
    if (metadataPath) {
      deleteSiteMetaData(metadataPath)
    }
  })

  siteWatcher.on(`change`, async (pkgJsonPath) => {
    console.log(`packagejson changed`, pkgJsonPath)
    const metadata = reverseLookup.get(pkgJsonPath)
    if (!metadata) {
      return
    }
    const siteInfo = sites.get(metadata)

    const newPkgJson = await fs.readJSON(pkgJsonPath)

    if (newPkgJson?.name && newPkgJson.name !== siteInfo?.name) {
      console.log(`changing site name`)
      mergeSiteInfo(metadata, { name: newPkgJson?.name })
    }
  })

  metadataWatcher.on(`add`, async (metadataPath) => {
    console.log({ metadataPath })
    const json = await getSiteInfo(metadataPath)
    if (json.name === `gatsby-desktop` || !json.sitePath) {
      return
    }
    const sitePkgJsonPath = path.resolve(json.sitePath, `package.json`)
    try {
      const packageJson = await fs.readJSON(sitePkgJsonPath)

      if (!packageJson) {
        deleteSiteMetaData(metadataPath)
        return
      }
      reverseLookup.set(sitePkgJsonPath, metadataPath)

      if (!json.name) {
        json.name = packageJson.name
      }

      if (!json.hash) {
        const [hash] = metadataPath.split(`/`)
        json.hash = hash
      }

      siteWatcher.add(sitePkgJsonPath)
    } catch (e) {
      console.log(`Couldn't load site`, e, sitePkgJsonPath)
      deleteSiteMetaData(metadataPath)
      return
    }
    console.log(`added`, json)
    sites.set(metadataPath, json)
    update(sites)
  })

  async function metadataChanged(path: string): Promise<void> {
    const json = await getSiteInfo(path)
    console.log(`changed`, json)
    const oldJson = JSON.stringify(sites.get(path) || {})
    if (JSON.stringify(oldJson) === JSON.stringify(json)) {
      return
    }

    if (!json.hash) {
      const [hash] = path.split(`/`)
      json.hash = hash
    }

    sites.set(path, json)
    update(sites)
  }

  metadataWatcher.on(`change`, metadataChanged)

  metadataWatcher.on(`unlink`, async (path) => {
    console.log(`deleted`, path)
    sites.delete(path)
    update(sites)
  })

  async function lockChanged(file: string): Promise<void> {
    const metadataPath = path.join(path.dirname(file), `metadata.json`)
    console.log(`lockfile changed`, file, `checking`, metadataPath)
    metadataChanged(metadataPath)
  }
  // The lockfiles are actually directories
  // lockWatcher.on(`addDir`, lockChanged)
  lockWatcher.on(`unlinkDir`, lockChanged)
}

export async function stopWatching(): Promise<void> {
  await metadataWatcher?.close()
  await siteWatcher?.close()
  await lockWatcher?.close()
}
