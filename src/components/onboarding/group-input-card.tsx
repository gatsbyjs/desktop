/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { ThemeCss } from "gatsby-interface"

const cardCss: ThemeCss = (theme) => [
  theme.cardStyles.frame,
  {
    border: `1px solid ${theme.colors.blackFade[10]}`,
  },
]

export interface IProps extends React.ComponentPropsWithoutRef<"label"> {
  input: React.ReactNode
}

export function GroupInputCard({
  children,
  input,
  ...rest
}: IProps): JSX.Element {
  return (
    <label
      css={cardCss}
      sx={{
        display: `flex`,
        alignItems: `center`,
        cursor: `pointer`,
        p: 5,
      }}
      {...rest}
    >
      <div
        sx={{
          minWidth: 0, // needed for text truncation to work properly
          paddingRight: 5,
        }}
      >
        <div
          sx={{
            fontFamily: `body`,
            fontWeight: `semiBold`,
            color: `grey.80`,
            fontSize: 1,
            lineHeight: `solid`,
            textOverflow: `ellipsis`,
            whiteSpace: `nowrap`,
            overflow: `hidden`,
          }}
        >
          {children}
        </div>
      </div>
      <Flex ml="auto">{input}</Flex>
    </label>
  )
}
