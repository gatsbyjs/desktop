/* eslint-disable @typescript-eslint/naming-convention */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { useSiteTabs } from "../util/site-runners"
import { Link, GatsbyLinkProps, navigate } from "gatsby"
import { GatsbySite } from "../controllers/site"
import { useCallback } from "react"
import { useLocation } from "@reach/router"
import { MdClear } from "react-icons/md"
import { SiteStatusDot } from "./site-status-dot"

interface ITabProps
  extends Omit<GatsbyLinkProps<unknown>, "to" | "ref" | "sx"> {
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
        fontSize: 0,
        fontWeight: 500,
        lineHeight: `default`,
        textDecoration: `none`,
        display: `flex`,
        alignItems: `center`,
        color: `whiteFade.60`,
        py: 3,
        pr: 2,
        pl: 3,
        "&.active": {
          backgroundColor: `purple.80`,
          color: `white`,
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
  const { removeTab } = useSiteTabs()

  const location = useLocation()

  const url = `/sites/${site.hash}`

  const isActive = location.pathname === url

  const remove = useCallback(() => {
    if (isActive) {
      navigate(`/sites`)
    }
    removeTab(site.hash)
  }, [removeTab, site, isActive])

  return (
    <Flex
      sx={{
        alignItems: `center`,
        pr: 2,
        py: 3,
        ...(isActive && {
          backgroundColor: `purple.80`,
          color: `white`,
        }),
      }}
    >
      <TabLink {...props} to={url}>
        <SiteStatusDot status={site.siteStatus.status} sx={{ mr: 2 }} />
        {site.name}
      </TabLink>
      <button
        onClick={remove}
        aria-label="Close tab"
        sx={{
          p: 3,
          background: `none`,
          border: `none`,
          fontFamily: `sans`,
          fontWeight: 500,
          textDecoration: `none`,
          color: `primaryBackground`,
          display: `flex`,
          alignItems: `center`,
        }}
      >
        <MdClear />
      </button>
    </Flex>
  )
}

export function TabNavigation(): JSX.Element {
  const { siteTabs } = useSiteTabs()
  return (
    <Flex
      as="nav"
      sx={{
        backgroundColor: `purple.90`,
      }}
      css={{
        WebkitAppRegion: `drag`,
        WebkitUserSelect: `none`,
        paddingLeft: 88,
      }}
    >
      <Link
        to="/sites"
        activeClassName="active"
        sx={{
          display: `flex`,
          alignItems: `center`,
          py: 3,
          px: 4,
          "&.active": {
            backgroundColor: `white`,
          },
          cursor: `pointer`,
        }}
        css={{ WebkitAppRegion: `no-drag` }}
        aria-label="All sites"
      >
        <img
          src={require(`../../assets/tinyicon.svg`)}
          width={16}
          height={16}
          alt=""
        />
      </Link>
      {siteTabs.map((site) => (
        <SiteTabLink key={site.hash} site={site} />
      ))}
    </Flex>
  )
}
