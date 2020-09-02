/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import {
  DiAtom,
  DiIntellij,
  DiSublime,
  DiVim,
  DiVisualstudio,
} from "react-icons/di"
import atom from "../../assets/editors/atom.png"
import emacs from "../../assets/editors/emacs.png"
import idea14ce from "../../assets/editors/intellij.png"
import phpstorm from "../../assets/editors/phpstorm.png"
import sublime from "../../assets/editors/sublime.png"
import vim from "../../assets/editors/vim.png"
import code from "../../assets/editors/vscode.png"
import visualstudio from "../../assets/editors/vsstudio.png"
import webstorm from "../../assets/editors/webstorm.png"

export type CodeEditor =
  | "code"
  | "sublime"
  | "atom"
  | "webstorm"
  | "phpstorm"
  | "idea14ce"
  | "vim"
  | "emacs"
  | "visualstudio"

export const ALL_EDITORS: CodeEditor[] = [
  `code`,
  `sublime`,
  `atom`,
  `webstorm`,
  `phpstorm`,
  `idea14ce`,
  `vim`,
  `emacs`,
  `visualstudio`,
]

export const editorLabels: Record<CodeEditor, string> = {
  atom: `Atom`,
  emacs: `Emacs`,
  idea14ce: `IntelliJ IDEA CE`,
  phpstorm: `PhpStorm`,
  sublime: `Sublime text`,
  vim: `Vim`,
  code: `Visual Studio Code`,
  visualstudio: `Visual Studio`,
  webstorm: `WebStorm`,
}

export const editorLogos: Record<CodeEditor, string> = {
  atom,
  emacs,
  idea14ce,
  phpstorm,
  sublime,
  vim,
  code,
  visualstudio,
  webstorm,
}

export const editorIcons: Record<CodeEditor, React.ReactNode> = {
  atom: <DiAtom />,
  emacs: <FakeEditorLogoIcon editor="emacs" />,
  idea14ce: <DiIntellij />,
  phpstorm: <FakeEditorLogoIcon editor="phpstorm" />,
  sublime: <DiSublime />,
  vim: <DiVim />,
  code: <FakeEditorLogoIcon editor="code" />,
  visualstudio: <DiVisualstudio />,
  webstorm: <FakeEditorLogoIcon editor="webstorm" />,
}

function FakeEditorLogoIcon({
  editor,
  ...rest
}: React.ComponentPropsWithoutRef<"svg"> & {
  editor: CodeEditor
}): JSX.Element {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      preserveAspectRatio="xMidYMid meet"
      sx={{
        filter: `grayscale(1)`,
      }}
      {...rest}
    >
      <image href={editorLogos[editor]} width="24" height="24" x="4" y="4" />
    </svg>
  )
}
