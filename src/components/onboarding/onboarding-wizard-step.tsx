/** @jsx jsx */
import { jsx } from "theme-ui"
import { Heading } from "gatsby-interface"

export interface IProps {
  currentStep: number
  totalSteps: number
  title: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
}

export function OnboardingWizardStep({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
}: IProps): JSX.Element {
  return (
    <div>
      <Heading
        as="h1"
        sx={{
          fontFamily: `sans`,
          fontWeight: `body`,
          fontSize: 1,
          color: `grey.60`,
          letterSpacing: `-0.02em`,
          mt: 0,
          mb: 8,
        }}
      >
        <span sx={{}}>
          Step {currentStep}/{totalSteps}
        </span>
        <span
          sx={{
            display: `block`,
            fontSize: 5,
            fontWeight: `extraBold`,
            color: `grey.90`,
            mt: 2,
            mb: 3,
          }}
        >
          {title}
        </span>
        <div>{subtitle}</div>
      </Heading>
      {children}
    </div>
  )
}

export function OnboardingWizardStepActions(
  props: React.ComponentPropsWithoutRef<"div">
): JSX.Element {
  return (
    <div
      {...props}
      sx={{
        mt: 10,
      }}
    />
  )
}
