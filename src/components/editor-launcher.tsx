/** @jsx jsx */
import { jsx } from "theme-ui"
import { Button } from "gatsby-interface"
import { DiVisualstudio } from "react-icons/di"
import { useCallback, useMemo, ReactNode } from "react"
import openInEditor from "open-in-editor"

type EditorType = "code"

export interface IProps {
  path: string
  editor: EditorType
}

const editorIcons: Record<EditorType, ReactNode> = {
  code: <DiVisualstudio />,
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
      rightIcon={editorIcons[editor]}
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
