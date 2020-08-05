/** @jsx jsx */
import { jsx } from "theme-ui"
import { Button } from "gatsby-interface"
import { MdCode } from "react-icons/md"
import { useCallback, useMemo } from "react"
import openInEditor from "open-in-editor"

export interface IProps {
  path: string
  editor: string
}

export function EditorLauncher({ path, editor = `code` }: IProps): JSX.Element {
  const editorInstance = useMemo(() => openInEditor.configure({ editor }), [
    editor,
  ])

  const openEditor = useCallback((): void => {
    editorInstance.open(path)
  }, [editorInstance])
  return (
    <Button
      onClick={openEditor}
      variant="GHOST"
      size="M"
      rightIcon={<MdCode />}
      sx={{
        fontFamily: `sans`,
        color: `gatsby`,
        fontWeight: 600,
        fontSize: 0,
        paddingLeft: 0,
      }}
    >
      Edit code
    </Button>
  )
}
