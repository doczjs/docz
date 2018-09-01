// @flow
import * as React from 'react'
import styled from 'styled-components/native'

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

type Props = {
  text: string,
  onPress: () => void
}

const Button = ({ text, onPress }: Props) => (
  <BlueButton onPress={onPress}>
    <WhiteText>{text}</WhiteText>
  </BlueButton>
)

export default Button