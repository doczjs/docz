import * as React from 'react'
import { Component } from 'react'
import { MenuItem } from 'docz'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from 'styled-components'

import { MenuLink, getActiveFromClass } from './MenuLink'
import { get } from '@utils/theme'

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
    const { item, sidebarToggle, collapseAll } = this.props

    const show = collapseAll || this.state.opened
    const hasChildren = !item.href && item.menu && item.menu.length > 0
    const hasToggle = !item.href && !item.route

    const handleToggle = (ev: any) => {
      ev.preventDefault()
      this.toggle()
    }

    return (
      <Wrapper>
        <MenuLink item={item} {...hasToggle && { onClick: handleToggle }}>
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
                    innerRef={(node: any) => {
                      this.$els = this.$els.concat([node])
                    }}
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

  private toggle = (): void => {
    this.setState(state => ({ opened: !state.opened }))
  }

  private checkActiveLink = (): void => {
    const hasActive = this.$els.some((el: any) => getActiveFromClass(el))
    if (hasActive) this.setState({ hasActive, opened: true })
  }
}
