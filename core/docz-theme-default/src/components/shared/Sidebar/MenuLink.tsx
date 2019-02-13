import * as React from 'react'
import { useMemo, useEffect, useRef, useState, SFC } from 'react'
import { MenuItem, useConfig, usePrevious } from 'docz'
import styled, { css } from 'styled-components'

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

export const getActiveFromClass = (el: HTMLElement | null) =>
  Boolean(el && el.classList.contains('active'))

interface LinkProps {
  item: MenuItem
  onClick?: React.MouseEventHandler<any>
  className?: string
  innerRef?: (node: any) => void
}

export const MenuLink: SFC<LinkProps> = ({
  item,
  children,
  onClick,
  innerRef,
}) => {
  const { linkComponent } = useConfig()
  const [active, setActive] = useState(false)
  const prevActive = usePrevious(active)
  const $el = useRef(null)
  const Link = useMemo(() => createLink(linkComponent), [linkComponent])

  const linkProps = {
    children,
    onClick,
  }

  const refFn = (node: any) => {
    innerRef && innerRef(node)
    $el.current = node
  }

  useEffect(() => {
    const isActive = getActiveFromClass($el.current)
    if (prevActive !== isActive) setActive(isActive)
  })

  return (
    <Wrapper active={active}>
      {item.route ? (
        <Link {...linkProps} innerRef={refFn} to={item.route} />
      ) : (
        <LinkAnchor
          {...linkProps}
          ref={refFn}
          href={item.href || '#'}
          target={item.href ? '_blank' : '_self'}
        />
      )}
      {active && item.route && <MenuHeadings route={item.route} />}
    </Wrapper>
  )
}
