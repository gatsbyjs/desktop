/** @jsx jsx */
import { jsx } from "theme-ui"
import { OnboardingIllustration } from "./onboarding-illustration"

export interface IProps {
  withIllustration?: boolean
}

export function OnboardingLayout({
  children,
  withIllustration = false,
}: React.PropsWithChildren<IProps>): JSX.Element {
  return (
    <main
      sx={{
        overflowY: `auto`,
        px: [`5%`, null, null, null, `15%`],
        pb: 10,
        pt: [12, null, null, null, `5rem`, `10rem`],
        fontFamily: `sans`,
      }}
    >
      {withIllustration && (
        <OnboardingIllustration
          sx={{
            position: `fixed`,
            right: [0, `-50%`, `-30%`, `-20%`, `0%`],
            top: [0, `-50%`, `-40%`, `-20%`, `0%`],
            zIndex: -1,
          }}
        />
      )}
      {children}
    </main>
  )
}
