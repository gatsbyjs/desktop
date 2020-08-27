/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { Button } from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"
import {
  OnboardingWizardStep,
  OnboardingWizardStepActions,
  IProps as WizardStepProps,
} from "./onboarding-wizard-step"
import { EditorsRadioButton } from "./editors-radio-button"

export interface IProps
  extends Pick<WizardStepProps, "currentStep" | "totalSteps"> {
  onGoNext: () => void
}

export function ChooseEditor({
  currentStep,
  totalSteps,
  onGoNext,
}: IProps): JSX.Element {
  const [preferredEditor, setPreferredEditor] = React.useState<string>(``)
  const onSubmit: React.FocusEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    // TODO do something with preferredEditor
    console.log(preferredEditor)

    onGoNext()
  }

  return (
    <OnboardingWizardStep
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Please select your preferred code editor"
      subtitle="You can always change this preference later."
    >
      <form onSubmit={onSubmit}>
        <EditorsRadioButton
          name="preferredEditor"
          editors={[
            `vscode`,
            `sublime`,
            `atom`,
            `webstorm`,
            `phpstorm`,
            `intellij`,
            `vim`,
            `emacs`,
            `vsstudio`,
          ]}
          onChange={(e): void => {
            setPreferredEditor(e.target.value)
          }}
        />
        <OnboardingWizardStepActions>
          <Button
            type="submit"
            rightIcon={<MdArrowForward />}
            disabled={!preferredEditor}
          >
            Import sites
          </Button>
        </OnboardingWizardStepActions>
      </form>
    </OnboardingWizardStep>
  )
}
