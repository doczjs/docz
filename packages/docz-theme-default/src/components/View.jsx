import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import styled from 'react-emotion'

import { Docs } from 'docz'

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
  margin: 0 0 20px;
`

const Section = styled('div')`
  margin-top: 50px;
`

const Doc = ({ id, name, description, sections }) => (
  <Container>
    <Title>{name}</Title>
    {description && <Description>{description}</Description>}
    {sections &&
      sections.length > 0 &&
      sections.map(section => (
        <Section key={section.id}>
          {section.title && <h3>{section.title}</h3>}
          <div>{section.render()}</div>
        </Section>
      ))}
  </Container>
)

export const View = () => (
  <Docs>
    {({ docs }) =>
      docs.map(doc => (
        <Route
          exact
          key={doc.id}
          path={doc.route}
          render={() => <Doc {...doc} />}
        />
      ))
    }
  </Docs>
)
