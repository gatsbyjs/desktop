/** @jsx jsx */
import { jsx } from "theme-ui"
import { navigate } from "gatsby"
import { ChooseEditor } from "../components/onboarding/choose-editor"
import { ChooseSites } from "../components/onboarding/choose-sites"
import { Layout } from "../components/layout"
import { OnboardingLayout } from "../components/onboarding/onboarding-layout"
import { OnboardingIntro } from "../components/onboarding/intro"

export interface IProps {
  pageContext: {
    step: OnboardingStep
  }
}

type OnboardingStep = "intro" | "editor" | "sites"

const ONBOARDING_STEPS_ORDER: OnboardingStep[] = [`intro`, `editor`, `sites`]

export default function OnboardingWizard({
  pageContext: { step },
}: IProps): JSX.Element {
  return (
    <Layout>
      <OnboardingLayout withIllustration={step === `intro`}>
        {step === `intro` && (
          <OnboardingIntro
            onGoNext={(): void => {
              navigate(`/onboarding/editor`)
            }}
          />
        )}
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
      </OnboardingLayout>
    </Layout>
  )
}
