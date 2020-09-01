/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { useSiteRunners } from "../../util/site-runners"
import { SitePreview } from "../../components/site-preview"
import { TabNavigation } from "../../components/tab-navigation"
import { Heading, Text } from "gatsby-interface"

export default function MainPage(): JSX.Element {
  const { sites } = useSiteRunners()

  return (
    <Grid
      css={{
        height: `100vh`,
        width: `100vw`,
        gridTemplateRows: `32px 1fr`,
      }}
    >
      <TabNavigation />
      <main
        sx={{
          px: 9,
          py: 7,
          overflowY: `auto`,
        }}
      >
        <Heading
          sx={{
            fontWeight: 600,
            fontFamily: `sans`,
            fontSize: 2,
          }}
        >
          All sites{` `}
          <Text as="span" size="S">
            ({sites.length})
          </Text>
        </Heading>
        <Grid
          gap={8}
          marginTop={7}
          columns="repeat(auto-fit, minmax(320px, 1fr))"
        >
          {sites.map((site) => (
            <SitePreview key={site.hash} site={site} />
          ))}
        </Grid>
      </main>
    </Grid>
  )
}
