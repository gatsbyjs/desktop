import React, { useCallback } from "react"
import { ipcRenderer } from "electron"
import { ISiteInfo, ISiteError, SiteError } from "../controllers/site"
import {
  Button,
  Text,
  Modal,
  ModalCard,
  StyledModal,
  StyledModalHeader,
  StyledModalBody,
  StyledModalActions,
} from "gatsby-interface"
import { trackEvent } from "../util/telemetry"

export function useSiteBrowser(
  onSelectSite?: (siteInfo: ISiteInfo) => void,
  onSiteError?: (error: ISiteError) => void
): readonly [() => void, JSX.Element] {
  const [siteError, setSiteError] = React.useState<ISiteError | null>(null)

  const closeErrorModal = (): void => setSiteError(null)

  const browse = useCallback(async () => {
    trackEvent(`CLICK_ADD_SITE`)
    console.log(`browsing`)
    // Sends a message to the main process asking for a file dialog.
    // It also verifies that it's a Gatsby site before returning it.
    const result: ISiteInfo | ISiteError | undefined = await ipcRenderer.invoke(
      `browse-for-site`
    )
    if (!result) {
      return
    }
    if (`error` in result) {
      setSiteError(result)
      onSiteError?.(result)
      return
    }

    onSelectSite?.(result)
  }, [onSelectSite])

  const errorModal = (
    <Modal
      aria-label="Failed to add a site"
      isOpen={Boolean(siteError)}
      onDismiss={closeErrorModal}
    >
      <ModalCard>
        <SiteErrorModal siteError={siteError} onDismiss={closeErrorModal} />
      </ModalCard>
    </Modal>
  )

  return [browse, errorModal]
}

function SiteErrorModal({
  siteError,
  onDismiss,
}: {
  siteError: ISiteError | null
  onDismiss: () => void
}): JSX.Element | null {
  if (!siteError) {
    return null
  }

  let title: string | null = null
  let message: React.ReactNode = null

  if (siteError.error === SiteError.NoGatsbyRepo) {
    title = `We couldn’t find a Gatsby site in that folder!`
    message = (
      <Text sx={{ m: 0 }}>
        Please check again and make sure the folder selected contains a Gatsby
        site. You can verify this by the presence of a{` `}
        <strong>gatsby-config.js</strong> file in the folder.
      </Text>
    )
  }

  return (
    <StyledModal variant="WARNING">
      <StyledModalHeader onCloseButtonClick={onDismiss}>
        {title ?? `Something went wrong`}
      </StyledModalHeader>
      <StyledModalBody>
        {message ?? siteError.message}
        <StyledModalActions>
          <div />
          <Button onClick={onDismiss}>Got it</Button>
        </StyledModalActions>
      </StyledModalBody>
    </StyledModal>
  )
}
