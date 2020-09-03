/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { useSiteRunners, useHiddenSites } from "../../util/site-runners"
import { Button, EmptyState, EmptyStatePrimaryAction } from "gatsby-interface"
import { SiteCheckboxGroup } from "./sites-checkbox-group"
import { MdArrowForward } from "react-icons/md"
import {
  OnboardingWizardStep,
  OnboardingWizardStepActions,
  IProps as WizardStepProps,
} from "./onboarding-wizard-step"
import { useSiteBrowser } from "../site-browser"
import { ISiteInfo } from "../../controllers/site"

export interface IProps
  extends Pick<WizardStepProps, "currentStep" | "totalSteps"> {
  onGoNext: () => void
}

export function ChooseSites({
  currentStep,
  totalSteps,
  onGoNext,
}: IProps): JSX.Element {
  const { sites, addSite } = useSiteRunners()
  const [hasAddedFirstSite, setHasAddedFirstSite] = React.useState<boolean>(
    false
  )
  const { hiddenSites, setHiddenSites, unhideSite } = useHiddenSites()

  const onAddSite = (siteInfo: ISiteInfo): void => {
    const site = addSite?.(siteInfo)
    if (!site) {
      return
    }
    // If we've previously hidden it, then unhide it
    unhideSite(site.hash)
    setHasAddedFirstSite(true)
  }

  const onSubmit: React.FocusEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    onGoNext()
  }

  const [browseSites, errorModal] = useSiteBrowser(onAddSite)

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
          <div sx={{ maxWidth: `52rem` }}>
            <EmptyState
              variant="BORDERED"
              heading="Are you missing some of your Gatsby sites?"
              text={
                <React.Fragment>
                  Gatsby Desktop is only able to auto-discover Gatsby sites
                  using Gatsby vX.XX.XX or newer. Don’t worry— you can add sites
                  using older versions manually and still manage them in Gatsby
                  Desktop.
                </React.Fragment>
              }
              primaryAction={
                <EmptyStatePrimaryAction type="button" onClick={browseSites}>
                  Add a site
                </EmptyStatePrimaryAction>
              }
            />
          </div>
        ) : (
          <SiteCheckboxGroup
            name="sitesToImport"
            sites={sites}
            hiddenSites={hiddenSites}
            browseSites={browseSites}
            setHiddenSites={setHiddenSites}
          />
        )}
        {!noSites && (
          <OnboardingWizardStepActions>
            <Button type="submit" rightIcon={<MdArrowForward />}>
              Start using Gatsby Desktop
            </Button>
          </OnboardingWizardStepActions>
        )}
      </form>
      {errorModal}
    </OnboardingWizardStep>
  )
}
