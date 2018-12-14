import { Component } from 'react'
import { Link, MenuItem, ThemeConfig } from 'docz'
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'

import { MenuHeadings } from './MenuHeadings'
import { get } from '@utils/theme'

interface WrapperProps {
  active: boolean
  theme?: any
}

const activeWrapper = css`
  padding-left: 0;

  &:after {
    width: 1px;
  }
`

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  transition: padding 0.2s;

  &:after {
    position: absolute;
    display: block;
    content: '';
    top: 30px;
    left: 24px;
    width: 0;
    height: calc(100% - 36px);
    border-left: 1px dashed ${get('colors.sidebarBorder')};
    transition: width 0.2s;
  }

  ${p => p.active && activeWrapper};
`

export const linkStyle = (colors: any) => css`
  position: relative;
  display: block;
  padding: 4px 24px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: ${colors.sidebarText};
  text-decoration: none;
  transition: color 0.2s;

  &:hover,
  &:visited {
    color: ${colors.sidebarText};
  }

  &:hover,
  &.active {
    color: ${colors.sidebarPrimary || colors.primary};
    font-weight: 600;
  }
`

const LinkAnchor = styled('a')`
  ${p => linkStyle(get('colors')(p))};
`

export const getActiveFromClass = (el: HTMLElement | null) =>
  Boolean(el && el.classList.contains('active'))

interface LinkProps {
  item: MenuItem
  onClick?: React.MouseEventHandler<any>
  className?: string
  innerRef?: (node: any) => void
}

interface LinkState {
  active: boolean
}

export class MenuLink extends Component<LinkProps, LinkState> {
  public $el: HTMLElement | null
  public state: LinkState = {
    active: false,
  }

  constructor(props: LinkProps) {
    super(props)
    this.$el = null
  }

  public componentDidUpdate(prevProps: LinkProps, prevState: LinkState): void {
    this.updateActive(prevState.active)
  }

  public componentDidMount(): void {
    this.updateActive(this.state.active)
  }

  public render(): React.ReactNode {
    const { active } = this.state
    const { item, children, onClick, innerRef } = this.props

    const commonProps = (config: any) => ({
      children,
      onClick,
      css: linkStyle(config.themeConfig) as any,
    })

    const refFn = (node: any) => {
      innerRef && innerRef(node)
      this.$el = node
    }

    return (
      <Wrapper active={active}>
        <ThemeConfig>
          {config => {
            const route: any = item.route === '/' ? '/' : item.route
            const props = { ...commonProps(config) }

            return item.route ? (
              <Link {...props} innerRef={refFn} to={route} />
            ) : (
              <LinkAnchor
                {...props}
                ref={refFn}
                href={item.href || '#'}
                target={item.href ? '_blank' : '_self'}
              />
            )
          }}
        </ThemeConfig>
        {active && item.route && <MenuHeadings route={item.route} />}
      </Wrapper>
    )
  }

  private updateActive = (prevActive: boolean): void => {
    const active = getActiveFromClass(this.$el)
    if (prevActive !== active) this.setState({ active })
  }
}
