/** @jsx jsx */
import { jsx } from "theme-ui"
import { Button, ButtonProps } from "gatsby-interface"

export function GhostButton(props: Omit<ButtonProps, "variant">): JSX.Element {
  return (
    <Button
      variant="GHOST"
      sx={{
        fontFamily: `sans`,
        color: `blue.60`,
        fontWeight: 500,
        ":hover": {
          color: `blue.90`,
        },
      }}
      {...props}
    />
  )
}
