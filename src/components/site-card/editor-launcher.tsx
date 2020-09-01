/** @jsx jsx */
import { jsx } from "theme-ui"
import { IconButton, Tooltip } from "gatsby-interface"
import { useCallback, useMemo } from "react"
import openInEditor from "open-in-editor"
import { editorIcons, CodeEditor } from "../../util/editors"

export interface IProps {
  path: string
  editor?: CodeEditor
}

export function EditorLauncher({ path, editor = `code` }: IProps): JSX.Element {
  const editorInstance = useMemo(() => openInEditor.configure({ editor }), [
    editor,
  ])

  const openEditor = useCallback((): void => {
    editorInstance.open(path)
  }, [editorInstance])
  return (
    <Tooltip label="Open in editor" sx={{ fontFamily: `sans`, fontSize: 0 }}>
      <IconButton
        onClick={openEditor}
        variant="GHOST"
        size="S"
        icon={editorIcons[editor]}
        sx={{
          color: `grey.50`,
          backgroundColor: `grey.20`,
          borderRadius: 1,
        }}
      >
        Edit code
      </IconButton>
    </Tooltip>
  )
}
