import Store from "electron-store"
import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react"
import { CodeEditor } from "./editors"
import ElectronStore from "electron-store"

/**
 * This module uses shared context to wrap and subscribe to electron-config
 */

interface IConfigType {
  siteTabs: Array<string>
  hiddenSites: Array<string>
  telemetryOptIn: boolean
  preferredEditor: CodeEditor
  hasRunOnboarding: boolean
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const ConfigContext = createContext<Store<IConfigType> | undefined>(undefined)
/**
 * Wraps the site root element in gatsby-browser
 */
export function ConfigProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <ConfigContext.Provider
      value={typeof window !== `undefined` ? new Store() : undefined}
    >
      {children}
    </ConfigContext.Provider>
  )
}

/**
 * A React hook that wraps `electron-config`.
 */

export function useConfig<K extends keyof IConfigType>(
  key: K
): [
  IConfigType[K] | undefined,
  (val: IConfigType[K]) => void,
  ElectronStore<IConfigType> | undefined
] {
  const store = useContext(ConfigContext)
  const [value, setValue] = useState<IConfigType[K] | undefined>(
    store?.get(key)
  )

  const setter = (val: IConfigType[K]): void => {
    setValue(val)
    store?.set(key, val)
  }

  useEffect((): (() => void) | undefined => {
    if (!store) {
      return undefined
    }
    const val = store.get(key)
    if (val !== value) {
      setValue(val)
    }
    return store.onDidChange(key, (val) => {
      setValue(val)
    })
  }, [key, setValue, store])

  return [value, setter, store]
}
