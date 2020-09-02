/** @jsx jsx */
import { jsx } from "theme-ui"
import { navigate } from "gatsby"
import { ChooseEditor } from "../../components/onboarding/choose-editor"
import { Layout } from "../../components/layout"
import { OnboardingLayout } from "../../components/onboarding/onboarding-layout"

export default function OnboardingEditorPage(): JSX.Element {
  return (
    <Layout>
      <OnboardingLayout>
        <ChooseEditor
          currentStep={2}
          totalSteps={3}
          onGoNext={(): void => {
            navigate(`/onboarding/sites`)
          }}
        />
      </OnboardingLayout>
    </Layout>
  )
}
