import * as React from 'react'
import { SFC } from 'react'
import styled from 'react-emotion'
import SearchIcon from 'react-feather/dist/icons/search'
import placeholder from 'polished/lib/mixins/placeholder'
import rgba from 'polished/lib/color/rgba'

import { get } from '@utils/theme'

const sidebarBorder = get('colors.sidebarBorder')
const sidebarText = get('colors.sidebarText')

const Wrapper = styled('div')`
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
  width: 20px;
  opacity: 0.5;
`

const Input = styled('input')`
  outline: none;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: ${sidebarText};

  ${p =>
    placeholder({
      color: rgba(sidebarText(p), 0.5),
    })};
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
