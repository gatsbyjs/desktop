/** @jsx jsx */
import { jsx } from "theme-ui"
import { navigate } from "gatsby"
import { ChooseSites } from "../../components/onboarding/choose-sites"
import { Layout } from "../../components/layout"
import { OnboardingLayout } from "../../components/onboarding/onboarding-layout"
import { useCallback } from "react"
import { useConfig } from "../../util/use-config"

export default function OnboardingSitesPage(): JSX.Element {
  const [hasRunOnboarding, setOnboardingDone] = useConfig(`hasRunOnboarding`)

  const onboardingDone = useCallback((): void => {
    setOnboardingDone(true)
    navigate(`/sites`)
  }, [setOnboardingDone])
  return (
    <Layout>
      <OnboardingLayout>
        <ChooseSites currentStep={3} totalSteps={3} onGoNext={onboardingDone} />
      </OnboardingLayout>
    </Layout>
  )
}
