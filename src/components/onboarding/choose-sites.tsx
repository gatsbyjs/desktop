/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { useSiteRunners } from "../../util/site-runners"
import { Button, EmptyState } from "gatsby-interface"
import { SiteCheckboxGroup } from "./sites-checkbox-group"
import { MdArrowForward } from "react-icons/md"
import {
  OnboardingWizardStep,
  OnboardingWizardStepActions,
  IProps as WizardStepProps,
} from "./onboarding-wizard-step"
import { SiteBrowser } from "../site-browser"
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

  const onAddSite = (siteInfo: ISiteInfo): void => {
    addSite?.(siteInfo)
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
                <SiteBrowser
                  type="button"
                  variant={noSites ? `PRIMARY` : `SECONDARY`}
                  size="L"
                  sx={{ mr: 5 }}
                  onSelectSite={onAddSite}
                >
                  Add a site
                </SiteBrowser>
              }
            />
          </div>
        ) : (
          <SiteCheckboxGroup name="sitesToImport" sites={sites} />
        )}
        {!noSites && (
          <OnboardingWizardStepActions>
            <SiteBrowser
              type="button"
              variant={noSites ? `PRIMARY` : `SECONDARY`}
              size="L"
              sx={{ mr: 5 }}
              onSelectSite={onAddSite}
            >
              Add a site
            </SiteBrowser>
            <Button type="submit" rightIcon={<MdArrowForward />}>
              Start using Gatsby Desktop
            </Button>
          </OnboardingWizardStepActions>
        )}
      </form>
    </OnboardingWizardStep>
  )
}
