import React from 'react'
import styled from 'styled-components/native'
import * as t from 'prop-types'

const scales = {
  small: `
    width: 100px;
    padding: 5px 10px;
    font-size: 14;
  `,
  normal: `
    width: 130px;
    padding: 10px 20px;
    font-size: 16;
  `,
  big: `
    width: 180px;
    padding: 20px 30px;
    font-size: 18;
  `,
}

const kind = (bg, color) => `
  background: ${bg};
  border-color: red;
  color: ${color};
  transition: all .3s;
`

const kinds = {
  primary: kind('#1FB6FF', 'white'),
  secondary: kind('#5352ED', 'white'),
  cancel: kind('#FF4949', 'white'),
  dark: kind('#273444', 'white'),
  gray: kind('#8492A6', 'white'),
}

const getScale = ({ scale = 'normal' }) => scales[scale]
const getKind = ({ kind = 'primary' }) => kinds[kind]

const ButtonStyled = styled.TouchableOpacity`
  ${getKind};
  ${getScale};
  cursor: pointer;
  margin: 3px 5px;
  border: 0;
  border-radius: 3px;
`

const Text = styled.Text`
  ${getScale};
  width: 100%;
  padding: 0;
  color: white;
  text-align: center;
  color: ${p => kinds[p.outline]};
`

export const Button = ({
  scale = 'normal',
  kind = 'primary',
  outline = false,
  children,
}: ButtonProps) => (
  <ButtonStyled scale={scale} kind={kind} outline={outline}>
    <Text scale={scale}>{children}</Text>
  </ButtonStyled>
)

Button.propTypes = {
  scales: t.oneOf(['small', 'normal', 'big']),
  kind: t.oneOf(['primary', 'secondary', 'cancel', 'dark', 'gray']),
}

Button.defaultProps = {
  scales: 'normal',
  kind: 'primary',
}
