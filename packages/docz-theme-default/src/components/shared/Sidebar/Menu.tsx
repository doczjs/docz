import * as React from 'react'
import { Component } from 'react'
import { Entry } from 'docz'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from 'react-emotion'

import { Link, linkStyle, getActiveFromClass } from './Link'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

interface ListProps {
  opened: boolean
}

const List = styled('dl')`
  visibility: ${(p: ListProps) => (p.opened ? 'visible' : 'hidden')};
  max-height: ${(p: ListProps) => (p.opened ? '9999px' : '0px')};
  transition: max-height 0.1s;
`

export const MenuLink = styled('a')`
  ${p => linkStyle(p.theme.docz)};
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
    stroke: ${p => p.theme.docz.colors.text};
  }
`

export interface MenuProps {
  menu: string
  docs: Entry[]
  sidebarToggle: (ev: React.SyntheticEvent<any>) => void
  collapseAll: boolean
}

export interface MenuState {
  opened: boolean
  hasActive: boolean
}

export class Menu extends Component<MenuProps, MenuState> {
  public $els: HTMLElement[]
  public state: MenuState = {
    opened: false,
    hasActive: false,
  }

  constructor(props: MenuProps) {
    super(props)
    this.$els = []
  }

  public componentDidMount(): void {
    this.checkActiveLink()
  }

  public render(): React.ReactNode {
    const { menu, docs, sidebarToggle, collapseAll } = this.props
    const show = collapseAll || this.state.opened
    const handleToggle = (ev: React.SyntheticEvent<any>) => {
      ev.preventDefault()
      this.toggle()
    }

    return (
      docs.length > 0 && (
        <Wrapper>
          <MenuLink href="#" onClick={handleToggle}>
            {menu}
            <Icon opened={show}>
              <ChevronDown size={15} />
            </Icon>
          </MenuLink>
          <List opened={show}>
            {docs.map(doc => (
              <dt key={doc.id}>
                <Link
                  onClick={sidebarToggle}
                  to={doc.route}
                  doc={doc}
                  ref={(node: any) => {
                    this.$els = this.$els.concat([node])
                  }}
                >
                  {doc.name}
                </Link>
              </dt>
            ))}
          </List>
        </Wrapper>
      )
    )
  }

  private toggle = (): void => {
    this.setState(state => ({ opened: !state.opened }))
  }

  private checkActiveLink = (): void => {
    const hasActive = this.$els.some(({ $el }: any) => getActiveFromClass($el))
    if (hasActive) this.setState({ hasActive, opened: true })
  }
}
