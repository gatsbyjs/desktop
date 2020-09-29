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
import { trackEvent } from "../../util/telemetry"

export function ManageInDesktop(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const openModal = (): void => {
    setIsOpen(true)
    trackEvent(`SHOW_MANAGE_SITE_HELP`)
  }

  return (
    <Fragment>
      <GhostButton onClick={openModal} size="S">
        Manage this site in Gatsby Desktop
      </GhostButton>
      <Modal
        aria-label="Manage this site in Gatsby Desktop"
        isOpen={isOpen}
        onDismiss={closeModal}
      >
        <ModalCard>
          <StyledModal variant="ACTION">
            <StyledModalHeader onCloseButtonClick={closeModal}>
              Manage this site in Gatsby Desktop
            </StyledModalHeader>
            <StyledModalBody>
              <Text sx={{ m: 0 }}>
                This site was started by running gatsby develop in the terminal.
                To manage it via Gatsby Desktop:
              </Text>
              <Text sx={{ mt: 5, mb: 0 }}>
                <ul sx={{ m: 0, listStyleType: `decimal` }}>
                  <li>
                    Stop the develop process in the terminal and then start it
                    from Gatsby Desktop, or
                  </li>
                  <li>Update the site to the latest Gatsby version.</li>
                </ul>
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
