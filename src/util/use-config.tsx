import Store from "electron-store"
import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react"

/**
 * This module uses shared context to wrap and subscribe to electron-config
 */

interface IConfigType {
  siteTabs: Array<string>
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
  const [store, setStore] = useState<Store<IConfigType>>()
  useEffect(() => {
    setStore(new Store())
  })

  return (
    <ConfigContext.Provider value={store}>{children}</ConfigContext.Provider>
  )
}

/**
 * A React hook that wraps `electron-config`.
 */

export function useConfig<K extends keyof IConfigType>(
  key: K
): [IConfigType[K] | undefined, (val: IConfigType[K]) => void] {
  const store = useContext(ConfigContext)

  const [value, setValue] = useState<IConfigType[K] | undefined>()

  const setter = (val: IConfigType[K]): void => {
    setValue(val)
    store?.set(key, val)
  }

  useEffect((): (() => void) | undefined => {
    if (!store) {
      return undefined
    }
    setValue(store.get(key))
    const unsubscribe = store.onDidChange(key, (val) => {
      setValue(val)
    })
    return unsubscribe
  }, [key, setValue, store])

  return [value, setter]
}
