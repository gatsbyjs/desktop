/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { useSiteRunners } from "../../util/site-runners"
import { SiteCard } from "../../components/site-card/site-card"
import { TabNavigation } from "../../components/tab-navigation"
import { Heading, Text, LinkButton } from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"

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
          <LinkButton
            to="/onboarding"
            size="S"
            variant="SECONDARY"
            rightIcon={<MdArrowForward />}
            sx={{ float: `right` }}
          >
            Onboarding
          </LinkButton>
        </Heading>
        <Grid
          gap={8}
          marginTop={7}
          columns="repeat(auto-fit, minmax(480px, 1fr))"
        >
          {sites.map((site) => (
            <SiteCard key={site.hash} site={site} />
          ))}
        </Grid>
      </main>
    </Grid>
  )
}
