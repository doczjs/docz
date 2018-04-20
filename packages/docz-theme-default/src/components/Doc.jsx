import React, { Component } from 'react'
import styled from 'react-emotion'

import { Highlight } from './Highlight'
import * as colors from '../styles/colors'

const Container = styled('div')`
  width: 960px;
  max-width: 960px;
  padding: 50px;
  margin: 0 auto;
`

const Title = styled('h2')`
  font-size: 48px;
  font-weight: 400;
  margin: 0;
`

const Description = styled('p')`
  margin: 0 0 10px;
`

const Section = styled('div')`
  margin-top: 50px;
`

const Render = styled('div')`
  position: relative;
  padding: 10px;
  background: white;
  border: 1px solid ${colors.GRAY};
  border-radius: 3px 3px 0 3px;
`

const CodeButton = styled('button')`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5px 10px;
  border: none;
  border-radius: 0 0 3px 3px;
  background: ${colors.GRAY};
  font-size: 10px;
  font-weight: 600;
  color: ${colors.GRAY_DARK};
  text-transform: uppercase;
  transform: translate(1px, 100%);
`

const Filepath = styled('code')`
  color: ${colors.GRAY_MEDIUM};
`

class DocSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showingCode: false,
    }
  }

  handleToggleCode = () =>
    this.setState({ showingCode: !this.state.showingCode })

  render() {
    const { section } = this.props
    const { showingCode } = this.state

    return (
      <Section key={section.id}>
        {section.title && <h3>{section.title}</h3>}
        <Render>
          {showingCode ? (
            <Highlight language="jsx">{section.code}</Highlight>
          ) : (
            <div>{section.render()}</div>
          )}
          <CodeButton onClick={this.handleToggleCode}>
            {showingCode ? 'Hide' : 'Show'} code
          </CodeButton>
        </Render>
      </Section>
    )
  }
}

export class Doc extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showingCode: false,
    }
  }

  handleToggleCode = () =>
    this.setState({ showingCode: !this.state.showingCode })

  render() {
    const { id, name, filepath, description, sections } = this.props
    const { showingCode } = this.state

    return (
      <Container key={id}>
        <Title>{name}</Title>
        {description && <Description>{description}</Description>}
        <Filepath>{filepath}</Filepath>
        {sections &&
          sections.length > 0 &&
          sections.map(section => (
            <DocSection key={section.id} section={section} />
          ))}
      </Container>
    )
  }
}
