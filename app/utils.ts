import { readJSON } from "fs-extra"
import { PackageJson } from "gatsby"
import path from "path"
export async function hasGatsbyInstalled(root: string): Promise<boolean> {
  try {
    const packageJson = await readJSON(
      path.join(root, `node_modules`, `gatsby`, `package.json`)
    )
    return packageJson?.name === `gatsby`
  } catch (e) {
    console.warn({ e })
    return false
  }
}

export async function loadPackageJson(root: string): Promise<PackageJson> {
  return readJSON(path.join(root, `package.json`))
}

export function hasGatsbyDependency(packageJson: PackageJson): boolean {
  const { dependencies = {}, devDependencies = {} } = packageJson
  return !!{ ...dependencies, ...devDependencies }.gatsby
}
