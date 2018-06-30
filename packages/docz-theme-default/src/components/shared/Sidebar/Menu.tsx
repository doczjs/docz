import * as React from 'react'
import { SFC } from 'react'
import { Entry } from 'docz'
import { Toggle } from 'react-powerplug'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from 'react-emotion'

import { Link, linkStyle } from './Link'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

export const MenuLink = styled('a')`
  ${linkStyle};
`

interface IconProps {
  opened: boolean
}

const iconRotate = (p: IconProps) => (p.opened ? '-180deg' : '0deg')

const Icon = styled('div')`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%) rotate(${iconRotate});
  transform-origin: 50% 50%;
  transition: transform 0.3s;

  & svg {
    stroke: ${p => p.theme.colors.text};
  }
`

export interface MenuProps {
  menu: string
  docs: Entry[]
  sidebarToggle: (ev: React.SyntheticEvent<any>) => void
}

export const Menu: SFC<MenuProps> = ({ menu, docs, sidebarToggle }) => (
  <Toggle initial={false}>
    {({ on, toggle }: any) => {
      const handleToggle = (ev: React.SyntheticEvent<any>) => {
        ev.preventDefault()
        toggle()
      }

      return (
        <Wrapper>
          <MenuLink href="#" onClick={handleToggle}>
            {menu}
            <Icon opened={on}>
              <ChevronDown size={15} />
            </Icon>
          </MenuLink>
          {on && (
            <dl>
              {docs.map(doc => (
                <dt key={doc.id}>
                  <Link onClick={sidebarToggle} to={doc.route} doc={doc}>
                    {doc.name}
                  </Link>
                </dt>
              ))}
            </dl>
          )}
        </Wrapper>
      )
    }}
  </Toggle>
)
