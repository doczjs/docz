import * as React from 'react'
import { useState } from 'react'
import { MenuItem } from 'docz'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from '@emotion/styled'

import { MenuLink } from './MenuLink'
import { get } from '~utils/theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

interface OpenedProps {
  opened: boolean
}

const List = styled.dl<OpenedProps>`
  flex: 1;
  overflow-y: auto;
  visibility: ${p => (p.opened ? 'visible' : 'hidden')};
  max-height: ${p => (p.opened ? 'auto' : '0px')};
`

const iconRotate = (p: OpenedProps) => (p.opened ? '-180deg' : '0deg')

const Icon = styled.div<OpenedProps>`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%) rotate(${iconRotate});
  transform-origin: 50% 50%;
  transition: transform 0.3s;

  & svg {
    stroke: ${get('colors.sidebarText')};
  }
`

export interface MenuProps {
  item: MenuItem
  sidebarToggle: (ev: React.SyntheticEvent<any>) => void
  collapseAll: boolean
}

export interface MenuState {
  opened: boolean
  hasActive: boolean
}

export const Menu: React.SFC<MenuProps> = props => {
  const [opened, setOpened] = useState(false)
  const toggle = () => setOpened(s => !s)

  const { item, sidebarToggle, collapseAll } = props
  const show = collapseAll || opened
  const hasChildren = !item.href && item.menu && item.menu.length > 0
  const hasToggle = !item.href && !item.route

  const handleToggle = (ev: any) => {
    ev.preventDefault()
    toggle()
  }

  return (
    <Wrapper>
      <MenuLink item={item} {...(hasToggle && { onClick: handleToggle })}>
        {item.name}
        {hasChildren && (
          <Icon opened={show}>
            <ChevronDown size={15} />
          </Icon>
        )}
      </MenuLink>
      {hasChildren && (
        <List opened={show}>
          {item.menu &&
            item.menu.map(item => (
              <dt key={item.id}>
                <MenuLink
                  item={item}
                  onClick={sidebarToggle}
                  onActiveChange={setOpened}
                >
                  {item.name}
                </MenuLink>
              </dt>
            ))}
        </List>
      )}
    </Wrapper>
  )
}
