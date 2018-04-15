import React, { Fragment } from 'react'
import styled from 'react-emotion'

import { Preview } from 'docz'

const Container = styled('div')`
  width: 960px;
  max-width: 960px;
  padding: 50px 20px;
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

export const View = () => (
  <Preview>
    {({ id, name, docDescription, sections }) => (
      <Container key={id}>
        <Title>{name}</Title>
        {docDescription && <Description>{docDescription}</Description>}
        {sections &&
          sections.length > 0 &&
          sections.map(section => (
            <Section key={section.id}>
              {section.title && <h3>{section.title}</h3>}
              <div>{section.render()}</div>
            </Section>
          ))}
      </Container>
    )}
  </Preview>
)
