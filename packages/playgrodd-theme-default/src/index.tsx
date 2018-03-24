import React, { Fragment } from 'react'
import { createTheme } from 'playgrodd'

import { List } from './components/List'
import { View } from './components/View'

export const Theme = createTheme(() => (
  <Fragment>
    <h1>Default theme</h1>
    <List />
    <View />
  </Fragment>
))
