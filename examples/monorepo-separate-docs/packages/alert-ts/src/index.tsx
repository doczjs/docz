import React from 'react'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

type Kind = keyof typeof kinds

type Props = { kind: Kind }

const AlertStyled: React.FC<Props> = ({ children, kind, ...rest }) => (
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

const Alert: React.FC<Props> = props => <AlertStyled {...props} />

Alert.defaultProps = {
  kind: 'info',
}

export default Alert
