import * as React from 'react'
import styled from 'styled-components/native'
import t from 'prop-types'

const BlueButton = styled.TouchableOpacity`
  background-color: blue;
  width: 100px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`

const WhiteText = styled.Text`
  color: #fff;
`

const Button = ({ text, onPress }) => (
  <BlueButton onPress={onPress}>
    <WhiteText>{text}</WhiteText>
  </BlueButton>
)

Button.propTypes = {
  text: t.string,
  onPress: t.func,
}

Button.defaultProps = {
  text: null,
}

export default Button