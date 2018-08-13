// @flow
import React from 'react'
import styled from 'react-emotion'

const scales = {
  small: `
    padding: 5px 10px;
    font-size: 14px;
  `,
  normal: `
    padding: 10px 20px;
    font-size: 16px;
  `,
  big: `
    padding: 20px 30px;
    font-size: 18px;
  `,
}

const kind = outline => (bg, color) => {
  const boxShadowColor = outline ? bg : 'transparent'
  const backgroundColor = outline ? 'transparent' : bg

  return `
    background: ${backgroundColor};
    box-shadow: inset 0 0 0 1px ${boxShadowColor};
    color: ${outline ? bg : color};
    transition: all .3s;

    &:hover {
      box-shadow: inset 0 0 0 1000px ${boxShadowColor};
      color: ${color};
    }
  `
}

const kinds = outline => {
  const get = kind(outline)

  return {
    primary: get('#1FB6FF', 'white'),
    secondary: get('#5352ED', 'white'),
    cancel: get('#FF4949', 'white'),
    dark: get('#273444', 'white'),
    gray: get('#8492A6', 'white'),
  }
}

const getScale = ({ scale = 'normal' }) => scales[scale]
const getKind = ({ kind = 'primary', outline = false }) => kinds(outline)[kind]

const ButtonStyled = styled('button')`
  ${getKind};
  ${getScale};
  cursor: pointer;
  margin: 3px 5px;
  border: none;
  border-radius: 3px;
`

type ButtonProps = {
  scale: 'small' | 'normal' | 'big',
  kind: 'primary' | 'secondary' | 'cancel' | 'dark' | 'gray',
  outline: boolean,
  children: Node,
}

export const Button = ({
  scale = 'normal',
  kind = 'primary',
  outline = false,
  children,
}: ButtonProps) => (
  <ButtonStyled scale={scale} kind={kind} outline={outline}>
    {children}
  </ButtonStyled>
)
