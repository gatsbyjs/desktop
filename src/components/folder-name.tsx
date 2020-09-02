/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { MdFolderOpen } from "react-icons/md"
import path from "path"

export interface IProps {
  sitePath: string
}

export function FolderName({ sitePath }: IProps): JSX.Element {
  const folder = path.basename(sitePath)
  return (
    <Flex
      marginTop="2"
      sx={{
        alignItems: `center`,
        fontWeight: `body`,
        color: `grey.60`,
        fontSize: 0,
        lineHeight: `default`,
      }}
    >
      <MdFolderOpen
        sx={{ marginRight: 2, flexShrink: 0 }}
        aria-label="Folder:"
      />
      <span
        sx={{
          minWidth: 0, // needed for text truncation to work properly
          textOverflow: `ellipsis`,
          whiteSpace: `nowrap`,
          overflow: `hidden`,
        }}
      >
        {folder}
      </span>
    </Flex>
  )
}
