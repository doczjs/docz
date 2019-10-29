import React from 'react'
import t from 'prop-types'
import { View, Text } from 'react-native'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

const AlertStyled = ({ children, kind, ...rest }) => (
  <View
    style={{
      padding: 20,
      background: 'white',
      borderRadius: 3,
      background: kinds[kind],
    }}
    {...rest}
  >
    <Text style={{ color: 'white' }}>{children}</Text>
  </View>
)

export const Alert = props => <AlertStyled {...props} />

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
}

Alert.defaultProps = {
  kind: 'info',
}
