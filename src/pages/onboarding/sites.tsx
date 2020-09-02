/** @jsx jsx */
import { jsx } from "theme-ui"
import { navigate } from "gatsby"
import { ChooseSites } from "../../components/onboarding/choose-sites"
import { Layout } from "../../components/layout"
import { OnboardingLayout } from "../../components/onboarding/onboarding-layout"

export default function OnboardingSitesPage(): JSX.Element {
  return (
    <Layout>
      <OnboardingLayout>
        <ChooseSites
          currentStep={3}
          totalSteps={3}
          onGoNext={(): void => {
            navigate(`/sites`)
          }}
        />
      </OnboardingLayout>
    </Layout>
  )
}
