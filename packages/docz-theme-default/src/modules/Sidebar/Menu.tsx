import * as React from 'react'
import { rem } from 'polished'
import { SFC } from 'react'
import { Entry, Link } from 'docz'
import { Toggle } from 'react-powerplug'
import { ChevronDown } from 'react-feather'
import styled, { css } from 'react-emotion'

import * as colors from '../../styles/colors'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

export const menuStyle = css`
  position: relative;
  display: block;
  padding: ${rem(20)} ${rem(30)};
  border-bottom: 1px solid ${colors.border};
  background: white;
  font-size: 18px;
  color: ${colors.steel};

  &:hover,
  &:visited {
    color: ${colors.steel};
  }
`

const Toggler = styled('a')`
  ${menuStyle};
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
    stroke: ${colors.steel};
  }
`

const List = styled('dl')`
  margin: 0;
  padding: 0;
  background: ${colors.snow};

  a {
    padding: 10px ${rem(30)};
    display: block;
    position: relative;
    border-bottom: 1px solid ${colors.border};
    color: ${colors.silver};
    font-size: ${rem(15)};
  }

  a:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${colors.purple};
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.3s;
  }

  a.hover::before,
  a.active:before {
    transform: scaleX(1);
  }
`

export interface MenuProps {
  menu: string
  docs: Entry[]
}

const isActive = (match: any, location: any) =>
  match && match.url === location.pathname

export const Menu: SFC<MenuProps> = ({ menu, docs }) => (
  <Toggle initial={false}>
    {({ on, toggle }: any) => {
      const handleToggle = (ev: React.SyntheticEvent<any>) => {
        ev.preventDefault()
        toggle()
      }

      return (
        <Wrapper>
          <Toggler href="#" onClick={handleToggle}>
            {menu}
            <Icon opened={on}>
              <ChevronDown size={15} />
            </Icon>
          </Toggler>
          {on && (
            <List>
              {docs.map(doc => (
                <dt key={doc.id}>
                  <Link isActive={isActive} to={doc.slug}>
                    {doc.name}
                  </Link>
                </dt>
              ))}
            </List>
          )}
        </Wrapper>
      )
    }}
  </Toggle>
)
