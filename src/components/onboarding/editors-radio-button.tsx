/** @jsx jsx */
import { jsx, Grid, Flex } from "theme-ui"
import React from "react"
import {
  useAriaFormGroupField,
  FormFieldset,
  FormLegend,
  FormError,
  StyledRadioButton,
} from "gatsby-interface"
import atom from "../../../assets/editors/atom.png"
import emacs from "../../../assets/editors/emacs.png"
import idea14ce from "../../../assets/editors/intellij.png"
import phpstorm from "../../../assets/editors/phpstorm.png"
import sublime from "../../../assets/editors/sublime.png"
import vim from "../../../assets/editors/vim.png"
import code from "../../../assets/editors/vscode.png"
import visualstudio from "../../../assets/editors/vsstudio.png"
import webstorm from "../../../assets/editors/webstorm.png"
import { visuallyHiddenCss } from "../../util/a11y"
import { GroupInputCard } from "./group-input-card"

const editorLabels: Record<CodeEditor, string> = {
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

const editorLogos: Record<CodeEditor, string> = {
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

export interface IProps {
  name: string
  editors: CodeEditor[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  required?: boolean
  error?: React.ReactNode
}

export function EditorsRadioButton({
  name,
  editors,
  onChange,
  required,
  error,
}: IProps): JSX.Element {
  const {
    getLegendProps,
    getOptionLabelProps,
    getOptionControlProps,
    errorProps,
  } = useAriaFormGroupField(`editors-radio-button`, {
    required: required,
    error,
  })

  return (
    <FormFieldset>
      <FormLegend
        css={visuallyHiddenCss}
        {...getLegendProps(`Please select your preferred code editor`)}
      />
      <Grid columns={3} gap={7}>
        {editors.map((editor) => {
          const optionValue = editor

          return (
            <GroupInputCard
              key={editor}
              {...getOptionLabelProps(optionValue)}
              input={
                <StyledRadioButton
                  {...getOptionControlProps(optionValue)}
                  value={optionValue}
                  onChange={onChange}
                  name={name}
                  css={{
                    // TODO remove this temp fix once this is fixed in gatsby-interface
                    "& + span::before": {
                      boxSizing: `border-box`,
                    },
                  }}
                />
              }
            >
              <Flex sx={{ alignItems: `center` }}>
                <img src={editorLogos[editor]} alt="" sx={{ mr: 5 }} />
                {editorLabels[editor]}
              </Flex>
            </GroupInputCard>
          )
        })}
      </Grid>
      <FormError {...errorProps} />
    </FormFieldset>
  )
}
