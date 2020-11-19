import React, { FC } from 'react'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

type Kind = keyof typeof kinds

interface Props {
  kind: Kind
}

const AlertStyled: FC<Props> = ({ children, kind, ...rest }) => (
  <div
    style={{
      padding: 20,
      borderRadius: 3,
      color: 'white',
      background: kinds[kind] || 'black',
    }}
    {...rest}
  >
    {children}
  </div>
)

const Alert: FC<Props> = props => <AlertStyled {...props} />

Alert.defaultProps = {
  kind: 'info',
}

export default Alert
