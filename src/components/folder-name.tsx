/** @jsx jsx */
import { jsx } from "theme-ui"
import { Text } from "gatsby-interface"
import { MdFolderOpen } from "react-icons/md"
import path from "path"

export interface IProps {
  sitePath: string
}

export function FolderName({ sitePath }: IProps): JSX.Element {
  const folder = path.basename(sitePath)
  return (
    <Text
      as="span"
      sx={{
        py: 2,
        fontFamily: `sans`,
        fontSize: 0,
        lineHeight: `12px`,
        color: `grey.60`,
        display: `flex`,
        alignItems: `center`,
      }}
    >
      <MdFolderOpen size={12} /> <span sx={{ paddingLeft: 2 }}>{folder}</span>
    </Text>
  )
}
