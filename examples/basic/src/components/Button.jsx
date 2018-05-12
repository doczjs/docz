import React from 'react'
import styled from 'react-emotion'
import t from 'prop-types'

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

const kinds = {
  primary: `
    background: #1FB6FF;
    color: white;
  `,
  secondary: `
    background: #592DEA;
    color: white;
  `,
}

const ButtonStyled = styled('button')`
  cursor: pointer;
  margin: 3px 5px;
  border: none;
  border-radius: 3px;
  ${({ scale = 'normal' }) => scales[scale]};
  ${({ kind = 'info' }) => kinds[kind]};
`

const Button = ({ children, ...props }) => (
  <ButtonStyled {...props}>{children}</ButtonStyled>
)

Button.propTypes = {
  scales: t.oneOf(['small', 'normal', 'big']),
  kind: t.oneOf(['primary', 'secondary']),
}

Button.defaultProps = {
  scales: 'normal',
  kind: 'primary',
}

export default Button
