/* eslint-disable @typescript-eslint/naming-convention */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Text } from "gatsby-interface"
import { useSiteRunners } from "./site-runners"
import { Link, GatsbyLinkProps } from "gatsby"
import { GatsbySite } from "../controllers/site"

interface ITabProps extends Omit<GatsbyLinkProps<unknown>, "to" | "ref"> {
  site: GatsbySite
}

export function TabLink(
  props: Omit<GatsbyLinkProps<unknown>, "ref">
): JSX.Element {
  return (
    <Link
      {...props}
      activeClassName="active"
      sx={{
        fontFamily: `sans`,
        fontSize: `12px`,
        fontWeight: 500,
        textDecoration: `none`,
        color: `primaryBackground`,
        backgroundColor: `gatsby`,
        p: 3,
        "&.active": {
          backgroundColor: `primaryBackground`,
          color: `gatsby`,
        },
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        whiteSpace: `nowrap`,
        cursor: `pointer`,
      }}
      css={{ WebkitAppRegion: `no-drag` }}
    />
  )
}

export function SiteTabLink({ site, ...props }: ITabProps): JSX.Element {
  return (
    <TabLink {...props} to={`/sites/${site.hash}`}>
      {site.name}
    </TabLink>
  )
}

export function TabNavigation(): JSX.Element {
  const { sites } = useSiteRunners()

  return (
    <Flex
      as="nav"
      css={{
        WebkitAppRegion: `drag`,
        WebkitUserSelect: `none`,
        paddingLeft: 88,
      }}
    >
      <TabLink to="/sites">Home</TabLink>
      {sites.map((site) => (
        <SiteTabLink key={site.root} site={site} />
      ))}
    </Flex>
  )
}
