import * as React from 'react'
import { SFC } from 'react'
import styled from 'react-emotion'
import SearchIcon from 'react-feather/dist/icons/search'

interface WrapperProps {
  showing: boolean
}

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 5px 30px;
  margin-bottom: 30px;
  border-top: 1px solid ${p => p.theme.colors.border};
  border-bottom: 1px solid ${p => p.theme.colors.border};
  opacity: ${(p: WrapperProps) => (p.showing ? 1 : 0)};
`

const Icon = styled(SearchIcon)`
  stroke: ${p => p.theme.colors.sidebarText};
  width: 20px;
  opacity: 0.5;
`

const Input = styled('input')`
  outline: none;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: ${p => p.theme.colors.sidebarText};
`

interface SearchProps {
  showing: boolean
  onSearch: (value: string) => void
}

export const Search: SFC<SearchProps> = ({ onSearch, showing }) => (
  <Wrapper showing={showing}>
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
