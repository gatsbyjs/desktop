/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { GatsbySite } from "../../controllers/site"
import {
  useAriaFormGroupField,
  FormFieldset,
  FormLegend,
  FormError,
  StyledCheckbox,
} from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"
import { visuallyHiddenCss } from "../../util/a11y"
import { GroupInputCard, GroupButtonCard } from "./group-input-card"
import { FolderName } from "../folder-name"
import { ChangeEvent, useCallback } from "react"

export interface IProps {
  name: string
  sites: GatsbySite[]
  required?: boolean
  error?: React.ReactNode
  hiddenSites: Array<string>
  setHiddenSites: (sites: Array<string>) => void
  browseSites: () => void
}

export function SiteCheckboxGroup({
  name,
  sites,
  required,
  error,
  hiddenSites = [],
  setHiddenSites,
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

  const toggleSites = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const hash = event.currentTarget.value
      if (event.currentTarget.checked) {
        setHiddenSites(hiddenSites.filter((site) => site !== hash))
      } else {
        setHiddenSites(Array.from(new Set([...hiddenSites, hash])))
      }
    },
    [setHiddenSites, hiddenSites]
  )

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
                  checked={!hiddenSites.includes(optionValue)}
                  name={name}
                  onChange={toggleSites}
                />
              }
              sx={{ pl: 7 }}
            >
              {site.name}
              <FolderName sitePath={site.root} />
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
