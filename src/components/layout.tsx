/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { ReactNode, PropsWithChildren, useCallback } from "react"
import { SettingsMenu } from "./settings-menu"
import { DropdownMenuItem, Text } from "gatsby-interface"
import { ipcRenderer } from "electron"

export interface IProps {
  headerItems?: ReactNode
}

export function Layout({
  children,
  headerItems,
}: PropsWithChildren<IProps>): JSX.Element {
  const quit = useCallback((): void => ipcRenderer.send(`quit-app`), [])
  return (
    <div>
      <Flex
        sx={{
          alignItems: `center`,
          position: `fixed`,
          height: `60px`,
          backgroundColor: `primaryBackground`,
          width: `100%`,
          px: 6,
        }}
      >
        <Flex sx={{ flex: `1 1 auto` }}>
          <img src={require(`../../assets/logo.svg`)} alt="Gatsby" />
        </Flex>
        <Flex>
          {headerItems}
          <SettingsMenu>
            <DropdownMenuItem onSelect={quit}>
              <Text as="span">Exit</Text>
            </DropdownMenuItem>
          </SettingsMenu>
        </Flex>
      </Flex>
      <Flex mx={6} sx={{ flexDirection: `column`, paddingTop: `60px` }}>
        {children}
      </Flex>
    </div>
  )
}
