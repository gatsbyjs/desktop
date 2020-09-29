/** @jsx jsx */
import { jsx } from "theme-ui"
import { Heading, Text, CheckboxFieldBlock, Button } from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"
import { useCallback, FormEvent } from "react"
import { useConfig } from "../../util/use-config"

export interface IProps {
  onGoNext: () => void
}

export function OnboardingIntro({ onGoNext }: IProps): JSX.Element {
  const onSubmit: React.FocusEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onGoNext()
  }

  const [optedIn = false, setOptedIn] = useConfig(`telemetryOptIn`)

  console.log({ optedIn })

  const onToggle = useCallback(
    (e: FormEvent<HTMLInputElement>): void => {
      setOptedIn(e.currentTarget.checked)
    },
    [setOptedIn]
  )

  return (
    <div
      sx={{
        maxWidth: `62rem`,
      }}
    >
      <Heading
        sx={{
          fontFamily: `sans`,
          fontSize: 9,
          fontWeight: `extraBold`,
          lineHeight: `dense`,
          letterSpacing: `-0.02em`,
          color: `grey.90`,
          marginBottom: 10,
        }}
      >
        <span
          sx={{
            display: `block`,
            color: `grey.60`,
            fontWeight: `normal`,
            fontSize: 1,
            lineHeight: `dense`,
          }}
        >
          Welcome to
        </span>
        Gatsby Desktop
      </Heading>
      <form onSubmit={onSubmit}>
        <Text sx={{ maxWidth: `20rem`, mt: 0, mb: 7 }}>
          Would you like to help us improve Gatsby Desktop by periodically
          submitting anonymous usage information?
        </Text>
        <CheckboxFieldBlock
          id="anonUsage"
          name="anonUsage"
          label="Yes, help improve Gatsby Desktop"
          onChange={onToggle}
          checked={optedIn}
        />
        <Button
          type="submit"
          rightIcon={<MdArrowForward />}
          size="L"
          sx={{ mt: 8 }}
        >
          Get started
        </Button>
      </form>
    </div>
  )
}
