import { menubar } from "menubar"
import path from "path"

const dir = path.resolve(__dirname, `..`)
const mb = menubar({
  dir,
  index: process.env.GATSBY_DEVELOP_URL
    ? process.env.GATSBY_DEVELOP_URL
    : `file://${dir}/public/index.html`,
  browserWindow: {
    webPreferences: {
      nodeIntegrationInWorker: true,
    },
  },
})

mb.on(`ready`, () => {
  console.log(`app is ready`)
})

// mb.on("after-create-window", () => {
//   mb.window?.op
// });
