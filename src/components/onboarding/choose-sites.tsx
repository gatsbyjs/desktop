/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import React from "react"
import { useSiteRunners } from "../../util/site-runners"
import { Button, Heading, ThemeCss, Text } from "gatsby-interface"
import { SiteCheckboxGroup } from "./sites-checkbox-group"
import { MdArrowForward } from "react-icons/md"
import {
  OnboardingWizardStep,
  OnboardingWizardStepActions,
  IProps as WizardStepProps,
} from "./onboarding-wizard-step"

export interface IProps
  extends Pick<WizardStepProps, "currentStep" | "totalSteps"> {
  onGoNext: () => void
}

export function ChooseSites({
  currentStep,
  totalSteps,
  onGoNext,
}: IProps): JSX.Element {
  const { sites } = useSiteRunners()
  const [hasAddedFirstSite, setHasAddedFirstSite] = React.useState<boolean>(
    false
  )

  const onAddSite = (): void => {
    // TODO let user to pick a site, then call setHasAddedFirstSite(true) if the site has been successfully added
    setHasAddedFirstSite(true)
  }

  const onSubmit: React.FocusEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(e.currentTarget.elements)

    const siteCheckboxes = e.currentTarget.elements.namedItem(
      `sitesToImport`
    ) as RadioNodeList

    const selectedSites = []
    for (const checkbox of siteCheckboxes) {
      if ((checkbox as HTMLInputElement).checked) {
        selectedSites.push((checkbox as HTMLInputElement).value)
      }
    }

    // TODO do something with selectedSites
    console.log(selectedSites)

    onGoNext()
  }

  const noSites = sites.length === 0

  return (
    <OnboardingWizardStep
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={
        noSites
          ? `We couldn’t find any Gatsby sites on your computer!`
          : hasAddedFirstSite
          ? `Nicely done!`
          : `We found some Gatsby sites on your computer!`
      }
      subtitle={noSites ? `` : `Select the sites you want to import.`}
    >
      <form onSubmit={onSubmit}>
        {noSites ? (
          <Box
            css={((theme) => theme.cardStyles.frame) as ThemeCss}
            sx={{
              borderWidth: 1,
              borderStyle: `solid`,
              borderColor: `blackFade.10`,
              fontSize: 1,
              color: `grey.60`,
              px: 7,
              py: 5,
            }}
          >
            <Heading
              as="h2"
              sx={{ color: `grey.80`, mt: 0, mb: 5, fontSize: `inherit` }}
            >
              Are you missing some of your Gatsby sites?
            </Heading>
            <Text sx={{ m: 0, fontSize: `inherit` }}>
              Gatsby Desktop is only able to auto-discover Gatsby sites using
              Gatsby vX.XX.XX or newer. Don’t worry— you can add sites using
              older versions manually and still manage them in Gatsby Desktop.
            </Text>
          </Box>
        ) : (
          <SiteCheckboxGroup name="sitesToImport" sites={sites} />
        )}
        <OnboardingWizardStepActions>
          <Button
            type="button"
            variant={noSites ? `PRIMARY` : `SECONDARY`}
            sx={{ mr: 5 }}
            onClick={onAddSite}
          >
            Add a site
          </Button>
          {!noSites && (
            <Button type="submit" rightIcon={<MdArrowForward />}>
              Start using Gatsby Desktop
            </Button>
          )}
        </OnboardingWizardStepActions>
      </form>
    </OnboardingWizardStep>
  )
}
