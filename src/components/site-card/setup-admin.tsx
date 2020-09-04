/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  Modal,
  ModalCard,
  Button,
  StyledModal,
  StyledModalHeader,
  StyledModalBody,
  StyledModalActions,
  Text,
} from "gatsby-interface"
import { Fragment, useState } from "react"
import { GhostButton } from "./ghost-button"

export function SetupAdmin(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = (): void => {
    setIsOpen(false)
  }

  return (
    <Fragment>
      <GhostButton onClick={(): void => setIsOpen(true)} size="S">
        Use Gatsby Admin with this site
      </GhostButton>
      <Modal
        aria-label="Use Gatsby Admin with this site"
        isOpen={isOpen}
        onDismiss={closeModal}
      >
        <ModalCard>
          <StyledModal variant="ACTION">
            <StyledModalHeader onCloseButtonClick={closeModal}>
              Use Gatsby Admin with this site
            </StyledModalHeader>
            <StyledModalBody>
              <Text sx={{ m: 0 }}>
                Please update to the latest Gatsby version in order to use
                Gatsby&nbsp;Admin for this site.
              </Text>
              <Text sx={{ mt: 5, mb: 0 }}>
                Your Gatsby version: <strong>TODO</strong>
                <br />
                Latest Gatsby version: <strong>TODO</strong>
              </Text>
              <StyledModalActions>
                <div />
                <Button onClick={closeModal}>Got it</Button>
              </StyledModalActions>
            </StyledModalBody>
          </StyledModal>
        </ModalCard>
      </Modal>
    </Fragment>
  )
}
