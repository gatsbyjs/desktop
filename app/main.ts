import { menubar } from "menubar"
import path from "path"
import { ipcMain, dialog, app, BrowserWindow } from "electron"
import detectPort from "detect-port"
import express from "express"
import serveStatic from "serve-static"
import {
  hasGatsbyInstalled,
  loadPackageJson,
  hasGatsbyDependency,
} from "./utils"
import { watchSites, stopWatching } from "./site-watcher"

const dir = path.resolve(__dirname, `..`)

function makeWindow(): BrowserWindow {
  return new BrowserWindow({
    title: `Gatsby Desktop`,
    titleBarStyle: `hidden`,
    fullscreenable: false,
    show: !process.env.GATSBY_DEVELOP_URL,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
    },
  })
}

async function start(): Promise<void> {
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

  const mb = menubar({
    dir,
    icon: path.resolve(dir, `assets`, `IconTemplate.png`),
    // In prod we can preload the window. In develop we need to wait for Gatsby to load
    preloadWindow: !process.env.GATSBY_DEVELOP_URL,
    // If we're running develop we pass in a URL, otherwise use the one
    // of the express server we just started
    index: makeUrl(`menubar`),
    browserWindow: {
      webPreferences: {
        nodeIntegrationInWorker: true,
        nodeIntegration: true,
      },
    },
  })

  let mainWindow: BrowserWindow | undefined

  app.on(`ready`, () => {
    mainWindow = makeWindow()
    // If we're not running develop we can preload the start page

    if (!process.env.GATSBY_DEVELOP_URL) {
      mainWindow.loadURL(makeUrl(`sites`))
      mainWindow.show()
    }
  })

  const childPids = new Set<number>()

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

  ipcMain.on(`add-child-pid`, (event, payload: number) => {
    childPids.add(payload)
  })

  ipcMain.on(`remove-child-pid`, (event, payload: number) => {
    childPids.delete(payload)
  })

  ipcMain.on(`watch-sites`, (event) => {
    watchSites((sites) => {
      console.log(`Got sites`, sites)
      event.sender.send(`sites-updated`, sites)
    })
  })

  ipcMain.on(`unwatch-sites`, () => {
    stopWatching()
  })

  app.on(`before-quit`, () => {
    childPids.forEach((pid) => process.kill(pid))
    stopWatching()
  })

  ipcMain.on(`quit-app`, () => {
    app.quit()
  })

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
      error: `The selected folder is not a Gatsby site. Please try another`,
    }
  })

  mb.on(`ready`, () => {
    console.log(`app is ready`)
  })
}

start()
