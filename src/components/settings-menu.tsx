/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItems,
  DropdownMenuItemsProps,
} from "gatsby-interface"

export function SettingsMenu(props: DropdownMenuItemsProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuButton
        sx={{
          background: `none`,
          border: `none`,
          // Give ourselves a big hit target, but align as if we didn't
          p: 4,
          marginRight: -4,
          my: -4,
          cursor: `pointer`,
          display: `flex`,
          alignItems: `center`,
          justifySelf: `flex-end`,
        }}
      >
        <img src={require(`../../assets/dots.svg`)} alt="Menu" />
      </DropdownMenuButton>
      <DropdownMenuItems sx={{ width: `50vw` }} {...props} />
    </DropdownMenu>
  )
}
