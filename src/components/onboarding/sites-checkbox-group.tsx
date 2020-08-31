/** @jsx jsx */
import { jsx, Grid, Flex } from "theme-ui"
import { GatsbySite } from "../../controllers/site"
import {
  useAriaFormGroupField,
  FormFieldset,
  FormLegend,
  FormError,
  StyledCheckbox,
} from "gatsby-interface"
import { MdFolderOpen } from "react-icons/md"
import { visuallyHiddenCss } from "../../util/a11y"
import { GroupInputCard } from "./group-input-card"

export interface IProps {
  name: string
  sites: GatsbySite[]
  required?: boolean
  error?: React.ReactNode
}

export function SiteCheckboxGroup({
  name,
  sites,
  required,
  error,
}: IProps): JSX.Element {
  const {
    getLegendProps,
    getOptionLabelProps,
    getOptionControlProps,
    errorProps,
  } = useAriaFormGroupField(`site-checkbox-group`, {
    required: required,
    error,
  })

  return (
    <FormFieldset>
      <FormLegend
        css={visuallyHiddenCss}
        {...getLegendProps(`Select the sites you want to import.`)}
      />
      <Grid columns={[null, 1, 1, `repeat(auto-fit, 300px)`]} gap={7}>
        {sites.map((site) => {
          console.log(site)
          const optionValue = site.hash

          return (
            <GroupInputCard
              key={optionValue}
              {...getOptionLabelProps(optionValue)}
              input={
                <StyledCheckbox
                  {...getOptionControlProps(optionValue)}
                  value={optionValue}
                  defaultChecked
                  name={name}
                  css={{
                    // TODO remove this temp fix once this is fixed in gatsby-interface
                    "& + span::before": {
                      boxSizing: `border-box`,
                    },
                  }}
                />
              }
              sx={{ pl: 7 }}
            >
              {site.name}
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
                <MdFolderOpen sx={{ marginRight: 2, flexShrink: 0 }} />
                <span
                  sx={{
                    minWidth: 0, // needed for text truncation to work properly
                    textOverflow: `ellipsis`,
                    whiteSpace: `nowrap`,
                    overflow: `hidden`,
                  }}
                >
                  {site.root.split(`/`).pop()}
                </span>
              </Flex>
            </GroupInputCard>
          )
        })}
      </Grid>
      <FormError {...errorProps} />
    </FormFieldset>
  )
}
