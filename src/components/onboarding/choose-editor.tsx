/** @jsx jsx */
import { jsx } from "theme-ui"
import React, { useCallback } from "react"
import { Button } from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"
import {
  OnboardingWizardStep,
  OnboardingWizardStepActions,
  IProps as WizardStepProps,
} from "./onboarding-wizard-step"
import { EditorsRadioButton } from "./editors-radio-button"
import { ALL_EDITORS, CodeEditor } from "../../util/editors"
import { useConfig } from "../../util/use-config"

export interface IProps
  extends Pick<WizardStepProps, "currentStep" | "totalSteps"> {
  onGoNext: () => void
}

export function ChooseEditor({
  currentStep,
  totalSteps,
  onGoNext,
}: IProps): JSX.Element {
  const [preferredEditor = ``, setPreferredEditor] = useConfig(
    `preferredEditor`
  )
  const onSubmit: React.FocusEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault()
      onGoNext()
    },
    [onGoNext]
  )

  console.log({ preferredEditor })

  const chooseEditor = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      console.log(`choosing editor `, event.target.value)
      setPreferredEditor(event.target.value as CodeEditor)
    },
    [setPreferredEditor]
  )

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
          editors={ALL_EDITORS}
          onChange={chooseEditor}
          selected={preferredEditor}
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
