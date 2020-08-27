/** @jsx jsx */
import { jsx, Grid } from "theme-ui"
import { TabNavigation } from "../../components/tab-navigation"
import { Heading, Text, CheckboxFieldBlock, Button } from "gatsby-interface"
import { OnboardingIllustration } from "../../components/onboarding/onboarding-illustration"
import { MdArrowForward } from "react-icons/md"
import { navigate } from "gatsby"

export default function OnboardingMainPage(): JSX.Element {
  const onSubmit: React.FocusEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const submitAnonUsageInfo = (e.currentTarget
      .elements as HTMLFormControlsCollection & { anonUsage: HTMLInputElement })
      .anonUsage.checked

    // TODO do something with the checkbox value
    console.log({ submitAnonUsageInfo })

    navigate(`/onboarding/editor`)
  }

  return (
    <Grid
      css={{
        height: `100vh`,
        width: `100vw`,
        gridTemplateRows: `32px 1fr`,
      }}
    >
      <TabNavigation />
      <main
        sx={{
          // px: 9,
          // py: 7,
          overflowY: `auto`,
          maxWidth: `62rem`,
          padding: `10rem 15% 0`,
          fontFamily: `sans`,
        }}
      >
        <OnboardingIllustration
          sx={{
            position: `absolute`,
            right: [0, `-50%`, `-30%`, `-20%`, `0%`],
            top: [0, `-50%`, `-40%`, `-20%`, `0%`],
            zIndex: -1,
          }}
        />
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
            label="Yes, submit anonymous usage information"
            css={{
              // TODO remove this temp fix once this is fixed in gatsby-interface
              "input + span::before": {
                boxSizing: `border-box`,
              },
            }}
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
      </main>
    </Grid>
  )
}
