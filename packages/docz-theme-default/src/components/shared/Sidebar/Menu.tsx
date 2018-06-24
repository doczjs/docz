import * as React from 'react'
import { SFC } from 'react'
import { Entry, Link } from 'docz'
import { Toggle } from 'react-powerplug'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

interface IconProps {
  opened: boolean
}

const iconRotate = (p: IconProps) => (p.opened ? '-180deg' : '0deg')

const Icon = styled.div`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%) rotate(${iconRotate});
  transform-origin: 50% 50%;
  transition: transform 0.3s;

  & svg {
    stroke: ${p => p.theme.colors.main};
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
                  <Link onClick={sidebarToggle} to={doc.route}>{doc.name}</Link>
                </dt>
              ))}
            </dl>
          )}
        </Wrapper>
      )
    }}
  </Toggle>
)
