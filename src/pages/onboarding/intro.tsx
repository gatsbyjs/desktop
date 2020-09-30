/** @jsx jsx */
import { jsx } from "theme-ui"
import { navigate } from "gatsby"
import { Layout } from "../../components/layout"
import { OnboardingLayout } from "../../components/onboarding/onboarding-layout"
import { OnboardingIntro } from "../../components/onboarding/intro"
import { trackEvent } from "../../util/telemetry"

export default function OnboardingIntroPage(): JSX.Element {
  return (
    <Layout>
      <OnboardingLayout withIllustration={true}>
        <OnboardingIntro
          onGoNext={(): void => {
            trackEvent(`onboarding-next`)
            navigate(`/onboarding/editor`)
          }}
        />
      </OnboardingLayout>
    </Layout>
  )
}
