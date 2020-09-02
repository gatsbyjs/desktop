/** @jsx jsx */
import { jsx } from "theme-ui"
import { navigate } from "gatsby"
import { Layout } from "../../components/layout"
import { OnboardingLayout } from "../../components/onboarding/onboarding-layout"
import { OnboardingIntro } from "../../components/onboarding/intro"

export default function OnboardingIntroPage(): JSX.Element {
  return (
    <Layout>
      <OnboardingLayout withIllustration={true}>
        <OnboardingIntro
          onGoNext={(): void => {
            navigate(`/onboarding/editor`)
          }}
        />
      </OnboardingLayout>
    </Layout>
  )
}
