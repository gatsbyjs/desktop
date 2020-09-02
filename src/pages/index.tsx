/** @jsx jsx */
import { jsx } from "theme-ui"
import { useConfig } from "../util/use-config"
import { navigate } from "gatsby"
import { ReactNode } from "react"
export default function Redirector(): ReactNode {
  const [onboardingDone] = useConfig(`hasRunOnboarding`)
  if (typeof window !== `undefined`) {
    if (onboardingDone) {
      navigate(`/sites`)
    } else {
      navigate(`/onboarding/intro`)
    }
  }

  return (
    <div
      sx={{
        width: `100vw`,
        height: `100vh`,
        backgroundColor: `purple.80`,
      }}
      onClick={(): Promise<void> => navigate(`/onboarding/intro`)}
    />
  )
}
