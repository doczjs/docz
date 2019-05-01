import * as React from 'react'
import { useMemo, useEffect, useRef, useState } from 'react'
import { MenuItem, useConfig, usePrevious } from 'docz'
import styled, { css } from 'styled-components'

import { MenuHeadings } from './MenuHeadings'
import { get } from '~utils/theme'

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

export const createLink = (Link: React.ComponentType<any>) => styled(Link)`
  position: relative;
  display: block;
  padding: 4px 24px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: ${get('colors.sidebarText')};
  text-decoration: none;
  transition: color 0.2s;

  &:hover,
  &:visited {
    color: ${get('colors.sidebarText')};
  }

  &:hover,
  &.active {
    color: ${p => get('colors.sidebarPrimary')(p) || get('colors.primary')(p)};
    font-weight: 600;
  }
`

const LinkAnchor = createLink(styled.a``)

const getActiveByLocation = (route: string) => {
  if (typeof window === 'undefined') return
  return location.pathname.slice(0, location.pathname.length - 1) === route
}

const getActiveFromClass = (
  el: HTMLElement | null,
  route: string | undefined
) => {
  const activeByClass = el && el.classList.contains('active')
  const activeByLocation = route && getActiveByLocation(route)
  return Boolean(activeByClass || activeByLocation)
}

const checkActiveClass = ($el: any, isActive: boolean) => {
  if (!isActive) return
  if (isActive && !$el.classList.contains('active')) {
    $el.classList.add('active')
  }
}

interface LinkProps {
  item: MenuItem
  onClick?: React.MouseEventHandler<any>
  className?: string
  innerRef?: (node: any) => void
  children?: React.ReactNode
  onActiveChange?: (active: boolean) => void
}

export const MenuLink = React.forwardRef<any, LinkProps>(
  ({ item, children, onClick, onActiveChange }, ref) => {
    const { linkComponent } = useConfig()
    const [active, setActive] = useState(false)
    const prevActive = usePrevious(active)
    const $el = useRef<any>(ref)
    const Link = useMemo(() => createLink(linkComponent!), [linkComponent])

    const linkProps = {
      children,
      onClick,
    }

    useEffect(() => {
      const isActive = getActiveFromClass($el.current, item.route)
      if (prevActive !== isActive) {
        setActive(isActive)
        $el && checkActiveClass($el.current, isActive)
        onActiveChange && onActiveChange(isActive)
      }
    })

    return (
      <Wrapper active={active}>
        {item.route ? (
          <Link
            {...linkProps}
            to={item.route}
            innerRef={$el}
            activeClassName="active"
            partiallyActive={true}
          />
        ) : (
          <LinkAnchor
            {...linkProps}
            ref={$el}
            href={item.href || '#'}
            target={item.href ? '_blank' : '_self'}
            {...!item.href && {
              onClick: (ev: any) => {
                ev.preventDefault()
                linkProps.onClick && linkProps.onClick(ev)
              },
            }}
          />
        )}
        {active && item.route && <MenuHeadings route={item.route} />}
      </Wrapper>
    )
  }
)

MenuLink.displayName = 'MenuLink'
