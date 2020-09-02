/** @jsx jsx */
import { jsx, Box, BoxProps } from "theme-ui"
import { keyframes } from "@emotion/core"
import { Status } from "../controllers/site"
import { getSiteDisplayStatus, SiteDisplayStatus } from "../util/site-status"

const pulse = keyframes({
  "0%": {
    transform: `scale(0.8)`,
    boxShadow: `0 0 0 0 rgba(0, 255, 0, 0.7)`,
  },
  "70%": {
    transform: `scale(1)`,
    boxShadow: `0 0 0 0 rgba(0, 255, 0, 0.7)`,
  },
  "100%": {
    transform: `scale(0.8)`,
    boxShadow: `0 0 0 0 rgba(0, 255, 0, 0)`,
  },
})

export interface IProps extends BoxProps {
  status: Status
}

export function SiteStatusDot({ status, ...rest }: IProps): JSX.Element {
  const displayStatus = getSiteDisplayStatus(status)

  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: 5,
        ...(displayStatus === SiteDisplayStatus.Stopped && {
          border: `grey`,
        }),
        ...(displayStatus === SiteDisplayStatus.Starting && {
          backgroundColor: `purple.40`,
          boxShadow: `0 0 0 0 rgba(217, 186, 232, 1)`,
          animation: `${pulse} 2s infinite`,
        }),
        ...(displayStatus === SiteDisplayStatus.Running && {
          backgroundColor: `green.40`,
        }),
        ...(displayStatus === SiteDisplayStatus.Errored && {
          backgroundColor: `orange.70`,
        }),
      }}
      {...rest}
    />
  )
}
