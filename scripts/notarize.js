/**
 * https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
 */

require(`dotenv`).config()
const { notarize } = require(`electron-notarize`)

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== `darwin`) {
    return undefined
  }

  const appName = context.packager.appInfo.productFilename

  return notarize({
    appBundleId: `com.gatsbyjs.desktop`,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  })
}
