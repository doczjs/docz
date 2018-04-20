import React from 'react'
import { doc } from 'docz-react'
import Markdown from 'react-markdown'

const description = `
## Introduction

A design system can help establish a common vocabulary between everyone in an organization. That’s why I’ve spent a great deal of time coming up with structure and naming for Vue Design System that would make sense. To start opening it up, let’s go through each layer in detail and what the terms mean:

- *Principles* are the foundation of the whole system. They form the basis of a good product and help the team with decision making. They are there to guide you and your team when working with the myriad parts of the system and help you do better and more informed decisions.
- *Design* Tokens are the atoms of the system as Salesforce describes them. In Vue Design System they are used instead of hard coded values to ensure a better consistency across any platform.
- *Elements* utilize decisions made on the token level. A simple example of an element would be a button, a link, or an input. Anything that cannot be broken down further. I use the name ‘element’ since everything in Vue and React world is nowadays ‘a component.’ Using that term for anything else would be confusing.
- *Patterns* are UI Patterns that fall on the more complex side of the spectrum. So for example things like a date picker, a data table, or a visualization. Patterns utilize both elements and tokens. If you wonder whether something should be called an element or a pattern, ask yourself this question: “Can this be broken down into smaller pieces?” If the answer is yes, it should most likely be a pattern in Vue Design System.
- *Templates* exist to document the layout and structure of a section. I am not calling these pages since semantically that would be incorrect. While they can be pages, that’s not their only functionality. Templates consist of the three things mentioned above: tokens, elements, and patterns.
`

doc('Overview')
  .route('/')
  .order(1)
  .description(<Markdown source={description} />)
