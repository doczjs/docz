import * as React from 'react'
import { SFC } from 'react'
import styled from 'react-emotion'
import SearchIcon from 'react-feather/dist/icons/search'

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 5px 24px;
  margin-bottom: 20px;
  border-top: 1px dotted ${p => p.theme.docz.colors.border};
  border-bottom: 1px dotted ${p => p.theme.docz.colors.border};
  opacity: 1;
`

const Icon = styled(SearchIcon)`
  stroke: ${p => p.theme.docz.colors.sidebarText};
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
  color: ${p => p.theme.docz.colors.sidebarText};
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
      onChange={ev => {
        onSearch && onSearch(ev.target.value)
      }}
    />
  </Wrapper>
)
