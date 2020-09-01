/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { TabNavigation } from "./tab-navigation"

export interface IProps {
  children: React.ReactNode
}

export function Layout({ children }: IProps): JSX.Element {
  return (
    <Grid
      css={{
        height: `100vh`,
        width: `100vw`,
        gridTemplateRows: `34px 1fr`,
      }}
      gap={0}
    >
      <TabNavigation />
      {children}
    </Grid>
  )
}
