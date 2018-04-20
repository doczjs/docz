import React, { Component } from 'react'
import * as Icon from 'react-feather'
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
  position: relative;
  font-size: 48px;
  font-weight: 200;
  margin: 0;

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 10%;
    height: 4px;
    background: ${colors.PURPLE};
  }
`

const IconLink = styled(Icon.Link)`
  margin-right: 10px;
`

const Filepath = styled('div')`
  display: flex;
  align-items: center;
  margin: 15px 0 0;
  color: ${colors.GRAY_MEDIUM};
`

const Description = styled('p')`
  margin: 20px 0 10px;
`

const Section = styled('div')`
  margin-top: 40px;
`

const Render = styled('div')`
  position: relative;
  padding: 10px;
  background: white;
  border: 1px solid ${colors.GRAY};
  border-radius: 3px 3px 0 3px;
`

const CodeButton = styled('button')`
  cursor: pointer;
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
            <Icon.Code width={15} />
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
    const { id, name, filepath, body, description, sections } = this.props
    const { showingCode } = this.state

    return (
      <Container key={id}>
        <Title>{name}</Title>
        <Filepath>
          <IconLink size={15} />
          <code>{filepath}</code>
        </Filepath>
        {description && <Description>{description}</Description>}
        {sections &&
          sections.length > 0 &&
          sections.map(section => (
            <DocSection key={section.id} section={section} />
          ))}
      </Container>
    )
  }
}
