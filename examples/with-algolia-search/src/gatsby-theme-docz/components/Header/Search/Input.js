import React from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'
import { SearchIcon, Form, Input } from './primitives'
import { Search } from 'gatsby-theme-docz/src/components/Icons'
import * as styles from 'gatsby-theme-docz/src/components/NavSearch/styles'

export default connectSearchBox(({ refine, ...rest }) => (
  <Form>
    <Input
      type="text"
      placeholder="Search"
      aria-label="Search"
      onChange={e => refine(e.target.value)}
      {...rest}
    />
    {/* <Search size={20} sx={styles.icon} /> */}
    <SearchIcon />
  </Form>
))
