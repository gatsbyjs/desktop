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
import { visuallyHiddenCss } from "../../util/a11y"
import { GroupInputCard } from "./group-input-card"
import { CodeEditor, editorLabels, editorLogos } from "../../util/editors"

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
      <Grid columns={[null, 1, 1, `repeat(auto-fit, 300px)`]} gap={7}>
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
