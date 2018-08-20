import * as React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import styled from 'styled-components/native';

const BlueButton = styled.TouchableOpacity`
 background-color: blue;
 width: 100px;
 height: 50px;
 justify-content: center;
align-items: center;
`

const WhiteText = styled.Text`
 color: #ffffff;
`

export default ({text}) => (
        <BlueButton  onPress={() => console.log('hello world')}>
        <WhiteText>{text}</WhiteText>
        </BlueButton>
)

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'red'
    }
})
