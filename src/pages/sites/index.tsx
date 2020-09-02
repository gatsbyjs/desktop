/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { useSiteRunners } from "../../util/site-runners"
import { SiteCard } from "../../components/site-card/site-card"
import { Heading, Text, LinkButton } from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"
import { Layout } from "../../components/layout"
import { useConfig } from "../../util/use-config"

export default function MainPage(): JSX.Element {
  const { filteredSites } = useSiteRunners()

  const [onboardingDone, setHasRunOnboarding, store] = useConfig(
    `hasRunOnboarding`
  )

  return (
    <Layout>
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
            ({filteredSites.length})
          </Text>
          <LinkButton
            to="/onboarding/intro"
            // Easter egg: right click to clear config
            onContextMenu={(): void => store?.clear()}
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
          columns="repeat(auto-fit, minmax(456px, 1fr))"
        >
          {filteredSites.map((site) => (
            <SiteCard key={site.hash} site={site} />
          ))}
        </Grid>
      </main>
    </Layout>
  )
}
