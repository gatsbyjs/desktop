/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { TabNavigation } from "../../components/tab-navigation"
import { navigate } from "gatsby"
import { ChooseEditor } from "../../components/onboarding/choose-editor"
import { ChooseSites } from "../../components/onboarding/choose-sites"

export interface IProps {
  params: {
    step: OnboardingStep
  }
}

type OnboardingStep = "editor" | "sites"

const ONBOARDING_STEPS_ORDER: OnboardingStep[] = [`editor`, `sites`]

export default function OnboardingWizard({
  params: { step },
}: IProps): JSX.Element {
  return (
    <Grid
      css={{
        height: `100vh`,
        width: `100vw`,
        gridTemplateRows: `32px 1fr`,
      }}
    >
      <TabNavigation />
      <main
        sx={{
          overflowY: `auto`,
          padding: `10rem 15% 0`,
          fontFamily: `sans`,
        }}
      >
        {step === `editor` && (
          <ChooseEditor
            currentStep={ONBOARDING_STEPS_ORDER.indexOf(`editor`) + 1}
            totalSteps={ONBOARDING_STEPS_ORDER.length}
            onGoNext={(): void => {
              navigate(`/onboarding/sites`)
            }}
          />
        )}
        {step === `sites` && (
          <ChooseSites
            currentStep={ONBOARDING_STEPS_ORDER.indexOf(`sites`) + 1}
            totalSteps={ONBOARDING_STEPS_ORDER.length}
            onGoNext={(): void => {
              navigate(`/sites`)
            }}
          />
        )}
      </main>
    </Grid>
  )
}
