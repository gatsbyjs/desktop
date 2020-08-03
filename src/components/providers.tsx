/** @jsx jsx */
import { jsx, ThemeProvider as ThemeUIProvider } from "theme-ui"
import { ThemeProvider, getTheme } from "gatsby-interface"
import { RunnerProvider } from "./site-runners"
import { ReactNode } from "react"
const baseTheme = getTheme()

const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    background: baseTheme.colors.primaryBackground,
  },
  fontWeights: {
    ...baseTheme.fontWeights,
    "500": 500,
  },
  borders: {
    none: `none`,
    default: `1px solid ${baseTheme.colors.whiteFade[20]}`,
    sixtywhite: `1px solid ${baseTheme.colors.whiteFade[40]}`,
    white: `1px solid ${baseTheme.colors.white}`,
    grey: `1px solid ${baseTheme.colors.grey[30]}`,
  },
  sizes: {
    // NOTE(@mxstbr): Hacks around issues with strict-ui that I have to fix upstream eventually
    "1px": `1px`,
    "100%": `100%`,
    "16px": `16px`,
    "15em": `15em`,
    "20em": `20em`,
    "1.5em": `1.5em`,
    initial: `initial`,
  },
}

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <RunnerProvider>
      <ThemeUIProvider theme={theme}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeUIProvider>
    </RunnerProvider>
  )
}
