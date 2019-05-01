import * as React from 'react'
import { SFC } from 'react'
import styled from 'styled-components'
import SearchIcon from 'react-feather/dist/icons/search'

import { get } from '~utils/theme'

const sidebarBorder = get('colors.sidebarBorder', '#CED4DE')
const sidebarText = get('colors.sidebarText', '#13161F')

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 24px;
  margin-bottom: 20px;
  border-top: 1px dotted ${sidebarBorder};
  border-bottom: 1px dotted ${sidebarBorder};
  opacity: 1;
`

const Icon = styled(SearchIcon)`
  stroke: ${sidebarText};
  min-width: 20px;
  opacity: 0.5;
`

const Input = styled.input`
  outline: none;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: ${sidebarText};
`

interface SearchProps {
  onSearch: (value: string) => void
}

export const Search: SFC<SearchProps> = ({ onSearch }) => (
  <Wrapper>
    <Icon />
    <Input
      type="text"
      placeholder="Search here..."
      onChange={(ev: any) => {
        onSearch && onSearch(ev.target.value)
      }}
    />
  </Wrapper>
)
