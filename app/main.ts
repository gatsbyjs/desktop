import { menubar } from "menubar"
import path from "path"
import { ipcMain, dialog } from "electron"
import detectPort from "detect-port"
import express from "express"
import serveStatic from "serve-static"

const dir = path.resolve(__dirname, `..`)

async function start(): Promise<void> {
  /**
   * Start a static server to serve the app's resources.
   * Gatsby doesn't like being served from a file URL
   */
  const port = await detectPort(9099)

  express()
    .use(serveStatic(path.resolve(dir, `public`)))
    .listen(port)

  const mb = menubar({
    dir,
    index: process.env.GATSBY_DEVELOP_URL || `http://localhost:${port}`,
    browserWindow: {
      webPreferences: {
        nodeIntegrationInWorker: true,
        nodeIntegration: true,
      },
    },
  })

  ipcMain.handle(`browse-for-site`, async () => {
    console.log(`Browsing for site`)
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: [`openDirectory`],
    })
    if (canceled) {
      return undefined
    }
    console.log({ filePaths })
    // TODO: check it's a Gatsby site here
    return filePaths
  })

  mb.on(`ready`, () => {
    console.log(`app is ready`)
  })
}

start()
