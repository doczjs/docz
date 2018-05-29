import * as React from 'react'
import { SFC } from 'react'
import { Entry, Link } from 'docz'
import { Toggle } from 'react-powerplug'
import { ChevronDown } from 'react-feather'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

interface IconProps {
  opened: boolean
}

const Icon = styled<IconProps, 'div'>('div')`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%) rotate(${p => (p.opened ? '-180deg' : '0deg')});
  transform-origin: 50% 50%;
  transition: transform 0.3s;

  & svg {
    stroke: ${p => p.theme.colors.main};
  }
`

export interface MenuProps {
  menu: string
  docs: Entry[]
}

export const Menu: SFC<MenuProps> = ({ menu, docs }) => (
  <Toggle initial={false}>
    {({ on, toggle }: any) => {
      const handleToggle = (ev: React.SyntheticEvent<any>) => {
        ev.preventDefault()
        toggle()
      }

      return (
        <Wrapper>
          <a href="#" onClick={handleToggle}>
            {menu}
            <Icon opened={on}>
              <ChevronDown size={15} />
            </Icon>
          </a>
          {on && (
            <dl>
              {docs.map(doc => (
                <dt key={doc.id}>
                  <Link to={doc.slug}>{doc.name}</Link>
                </dt>
              ))}
            </dl>
          )}
        </Wrapper>
      )
    }}
  </Toggle>
)
