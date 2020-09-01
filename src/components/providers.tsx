/** @jsx jsx */
import { jsx, ThemeProvider, merge, Theme } from "theme-ui"
import { getTheme } from "gatsby-interface"
import { RunnerProvider } from "../util/site-runners"
import { ReactNode } from "react"
import "typeface-inter"
import "typeface-roboto-mono"
import { ConfigProvider } from "../util/use-config"

const baseTheme = getTheme()

// The cast is because there is a breaking change to the typings,
// between theme-ui versions, switching from arrays to readonly tuples
const theme = merge((baseTheme as unknown) as Theme, {
  colors: {
    background: baseTheme.colors.primaryBackground,
  },
  fontWeights: {
    "500": 500,
  },
  fonts: {
    mono: `Roboto Mono`,
  },
  borders: {
    none: `none`,
    default: `1px solid ${baseTheme.colors.whiteFade[20]}`,
    sixtywhite: `1px solid ${baseTheme.colors.whiteFade[40]}`,
    white: `1px solid ${baseTheme.colors.white}`,
    grey: `1px solid ${baseTheme.colors.grey[30]}`,
  },
})

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ConfigProvider>
      <RunnerProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </RunnerProvider>
    </ConfigProvider>
  )
}
