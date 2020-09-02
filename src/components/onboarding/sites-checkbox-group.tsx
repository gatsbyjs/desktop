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
import { MdFolderOpen, MdArrowForward } from "react-icons/md"
import { visuallyHiddenCss } from "../../util/a11y"
import { GroupInputCard, GroupButtonCard } from "./group-input-card"

export interface IProps {
  name: string
  sites: GatsbySite[]
  required?: boolean
  error?: React.ReactNode
  hiddenSites: Array<string>
  browseSites: () => void
}

export function SiteCheckboxGroup({
  name,
  sites,
  required,
  error,
  hiddenSites = [],
  browseSites,
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
          const optionValue = site.hash
          const hidden = hiddenSites.includes(optionValue)
          return (
            <GroupInputCard
              // We need this because we do an initial render before the config comes through
              // and if the key is the same it won't re-render the checkbox with the new default
              key={`${optionValue}${hidden}`}
              {...getOptionLabelProps(optionValue)}
              input={
                <StyledCheckbox
                  {...getOptionControlProps(optionValue)}
                  value={optionValue}
                  defaultChecked={!hidden}
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
        <GroupButtonCard icon={<MdArrowForward />} onClick={browseSites}>
          Add another site
        </GroupButtonCard>
      </Grid>
      <FormError {...errorProps} />
    </FormFieldset>
  )
}
