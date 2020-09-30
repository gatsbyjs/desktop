/** @jsx jsx */
import { jsx } from "theme-ui"
import { IconButton, Tooltip } from "gatsby-interface"
import { useMemo, useCallback } from "react"
import openInEditor from "open-in-editor"
import { editorIcons, CodeEditor, editorLabels } from "../../util/editors"
import { trackEvent } from "../../util/telemetry"

export interface IProps {
  path: string
  editor?: CodeEditor
  siteHash?: string
}

export function EditorLauncher({
  path,
  editor = `code`,
  siteHash,
}: IProps): JSX.Element {
  const editorInstance = useMemo(() => openInEditor.configure({ editor }), [
    editor,
  ])

  const openEditor = useCallback((): void => {
    trackEvent(`LAUNCH_EDITOR`, { name: editor, siteHash })
    editorInstance.open(path)
  }, [editor, siteHash, editorInstance])

  return (
    <Tooltip
      label={`Open in ${editorLabels[editor]}`}
      sx={{ fontFamily: `sans`, fontSize: 0 }}
    >
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
