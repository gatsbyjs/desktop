/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItems,
  DropdownMenuItemsProps,
} from "gatsby-interface"

import { BsThreeDots } from "react-icons/bs"
export function SettingsMenu(props: DropdownMenuItemsProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuButton
        aria-label="Menu"
        sx={{
          background: `none`,
          //   border: `none`,
          px: 4,
          py: 2,
        }}
      >
        <BsThreeDots size="18px" />
      </DropdownMenuButton>
      <DropdownMenuItems {...props} />
    </DropdownMenu>
  )
}
