import path from "path"
import {
  ipcMain,
  dialog,
  app,
  BrowserWindow,
  Tray,
  Menu,
  Event,
} from "electron"
import detectPort from "detect-port"
import express from "express"
import serveStatic from "serve-static"
import fixPath from "fix-path"

import {
  hasGatsbyInstalled,
  loadPackageJson,
  hasGatsbyDependency,
} from "./utils"
import { watchSites, stopWatching, ISiteMetadata } from "./site-watcher"
import { SiteLauncher, Message } from "./launcher"
import { Status, LogObject, SiteError } from "./ipc-types"
interface ISiteStatus {
  startedInDesktop?: boolean
  status: Status
  logs: Array<LogObject>
  rawLogs: Array<string>
}

const dir = path.resolve(__dirname, `..`)

function makeWindow(): BrowserWindow {
  return new BrowserWindow({
    title: `Gatsby Desktop`,
    titleBarStyle: `hidden`,
    fullscreenable: false,
    show: !process.env.GATSBY_DEVELOP_URL,
    trafficLightPosition: { x: 8, y: 18 },
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
    },
  })
}

async function start(): Promise<void> {
  fixPath()
  /**
   * Start a static server to serve the app's resources.
   * Gatsby doesn't like being served from a file URL
   */
  const port = await detectPort(9099)

  express()
    .use(serveStatic(path.resolve(dir, `public`)))
    .listen(port)

  const makeUrl = (path: string): string =>
    process.env.GATSBY_DEVELOP_URL
      ? `${process.env.GATSBY_DEVELOP_URL}/${path}`
      : `http://localhost:${port}/${path}`

  let mainWindow: BrowserWindow | undefined

  let siteList: Array<{ site: ISiteMetadata; status?: ISiteStatus }> = []

  const siteLaunchers = new Map<string, SiteLauncher>()

  function openMainWindow(): void {
    if (!mainWindow || mainWindow.isDestroyed()) {
      mainWindow = makeWindow()
      mainWindow.loadURL(makeUrl(`sites`))
    } else {
      if (!mainWindow.webContents.getURL()) {
        mainWindow.loadURL(makeUrl(`sites`))
      }
    }
    mainWindow.show()
  }

  let tray: Tray | undefined

  app.on(`ready`, () => {
    mainWindow = makeWindow()

    tray = new Tray(path.resolve(dir, `assets`, `IconTemplate.png`))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: `Show Gatsby Desktop`,
        click: openMainWindow,
      },
      {
        label: `Quit...`,
        click: async (): Promise<void> => {
          openMainWindow()
          const { response } = await dialog.showMessageBox({
            message: `Quit Gatsby Desktop?`,
            detail: `This will stop all running sites`,
            buttons: [`Cancel`, `Quit`],
            defaultId: 1,
            type: `question`,
          })

          if (response === 1) {
            app.quit()
          }
        },
      },
    ])
    tray.setContextMenu(contextMenu)

    watchSites((sites) => {
      siteList = sites.map((site) => {
        const launcher = site.hash && siteLaunchers.get(site.hash)
        if (!launcher) {
          return {
            site,
          }
        }
        const { logs, rawLogs, status } = launcher
        return {
          site,
          status: { startedInDesktop: true, logs, rawLogs, status },
        }
      })
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow?.webContents?.send(`sites-updated`, siteList)
      }
    })

    // If we're not running develop we can preload the start page

    if (!process.env.GATSBY_DEVELOP_URL) {
      mainWindow.loadURL(makeUrl(`sites`))
      mainWindow.show()
    }
  })

  ipcMain.on(`open-main`, async (event, payload?: string) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      mainWindow = makeWindow()
    }
    const url = makeUrl(payload ? `sites/${payload}` : `sites`)
    if (mainWindow.webContents.getURL() !== url) {
      mainWindow.loadURL(url)
    }
    mainWindow.show()
  })

  ipcMain.on(
    `launch-site`,
    async (event, { root, hash, clean }): Promise<number | undefined> => {
      if (!root || !hash) {
        console.error(`Invalid launch params`, { root, hash })
        return undefined
      }
      let launcher = siteLaunchers.get(hash)
      if (!launcher) {
        launcher = new SiteLauncher(root, hash)
        launcher.setListener((message: Message) => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents?.send(`site-message`, hash, message)
          }
        })
        siteLaunchers.set(hash, launcher)
      }
      return launcher.start(clean)
    }
  )

  ipcMain.on(
    `stop-site`,
    async (event, { hash, pid }): Promise<void> => {
      if (!hash) {
        console.error(`Missing site hash`)
        return
      }
      const launcher = siteLaunchers.get(hash)
      if (launcher) {
        launcher.stop()
        return
      }
      if (pid) {
        process.kill(pid)
      } else {
        console.error(`Site not found`)
      }
    }
  )

  app.on(`before-quit`, () => {
    siteLaunchers.forEach((site) => site.stop())
    stopWatching()
  })

  app.on(`activate`, (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) {
      openMainWindow()
    }
  })

  ipcMain.on(`quit-app`, () => {
    app.quit()
  })

  ipcMain.handle(`get-sites`, async () => siteList)

  // This request comes from the renderer
  ipcMain.handle(`browse-for-site`, async () => {
    console.log(`Browsing for site`)
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: [`openDirectory`],
    })
    if (canceled || !filePaths?.length) {
      return undefined
    }

    const path = filePaths[0]
    try {
      const packageJson = await loadPackageJson(path)
      // i.e. actually installed in node_modules
      if (await hasGatsbyInstalled(path)) {
        return { packageJson, path }
      }
      // Has a dependency but it hasn't been installed
      if (hasGatsbyDependency(packageJson)) {
        return {
          packageJson,
          path,
          warning: `The site ${packageJson.name} is a Gatsby site, but needs dependencies to be installed before it can be started`,
        }
      }
    } catch (e) {
      console.log(e)
    }
    return {
      error: SiteError.NoGatsbyRepo,
      message: `The selected folder is not a Gatsby site. Please try another`,
    }
  })
}

app.on(`window-all-closed`, (event: Event) => {
  //  Don't quit when all windows are closed
  event.preventDefault()
})

start()
