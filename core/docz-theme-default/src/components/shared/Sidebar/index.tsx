import * as React from 'react'
import { Fragment, SFC, useState, useEffect } from 'react'
import { useMenus, useWindowSize, usePrevious } from 'docz'
import styled from 'styled-components'

import { Logo } from '../Logo'
import { Search } from '../Search'
import { Menu } from './Menu'
import { Docz } from './Docz'
import { Hamburguer } from './Hamburguer'

import { get } from '@utils/theme'
import { mq, breakpoints } from '@styles/responsive'

interface WrapperProps {
  opened: boolean
  theme?: any
}

const sidebarBg = get('colors.sidebarBg')
const sidebarText = get('colors.sidebarText')
const sidebarBorder = get('colors.sidebarBorder')

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  width: 280px;
  min-width: 280px;
  min-height: 100vh;
  background: ${sidebarBg};
  transition: transform 0.2s, background 0.3s;
  z-index: 1000;

  ${mq({
    position: ['absolute', 'absolute', 'absolute', 'relative'],
  })};

  dl {
    padding: 0;
    margin: 0 16px;
  }

  dl a {
    font-weight: 400;
  }

  @media screen and (max-width: ${breakpoints.desktop - 1}px) {
    transform: translateX(${p => (p.opened ? '-100%' : '0')});
  }

  ${get('styles.sidebar')};
`

const Content = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 280px;
  min-width: 280px;
  height: 100%;
  max-height: 100vh;
`

const Menus = styled.nav`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`

const Empty = styled.div`
  flex: 1;
  opacity: 0.7;
  padding: 0 24px;
  color: ${sidebarText};
`

const Footer = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${sidebarText};
  border-top: 1px dashed ${sidebarBorder};
`

const FooterLink = styled.a`
  padding: 0;
  margin: 0;
  margin-left: 5px;
`

const FooterLogo = styled(Docz)<{ width: number }>`
  fill: ${sidebarText};
`

interface OpenProps {
  opened: boolean
}

const ToggleBackground = styled.div<OpenProps>`
  content: '';
  display: ${p => (p.opened ? 'none' : 'block')};
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 99;
`

export const Sidebar: SFC = () => {
  const [hidden, setHidden] = useState(true)
  const [query, setQuery] = useState('')
  const menus = useMenus({ query })
  const windowSize = useWindowSize()
  const isDesktop = windowSize.outerWidth >= breakpoints.desktop
  const prevIsDesktop = usePrevious(isDesktop)

  useEffect(() => {
    if (!hidden && !prevIsDesktop && isDesktop) {
      setHidden(true)
      document.documentElement!.classList.remove('with-overlay')
    }
  })

  const addOverlayClass = (isHidden: boolean) => {
    const method = !isHidden ? 'add' : 'remove'

    if (window && typeof window !== 'undefined' && !isDesktop) {
      document.documentElement!.classList[method]('with-overlay')
    }
  }

  const handleSidebarToggle = () => {
    setHidden(s => !s)
    addOverlayClass(!hidden)
  }

  return (
    <Fragment>
      <Wrapper opened={hidden}>
        <Content>
          <Hamburguer opened={!hidden} onClick={handleSidebarToggle} />
          <Logo showBg={!hidden} />
          <Search onSearch={setQuery} />

          {menus && menus.length === 0 ? (
            <Empty>No documents found.</Empty>
          ) : (
            <Menus>
              {menus &&
                menus.map(menu => (
                  <Menu
                    key={menu.id}
                    item={menu}
                    sidebarToggle={handleSidebarToggle}
                    collapseAll={Boolean(query.length)}
                  />
                ))}
            </Menus>
          )}
          <Footer>
            Built with
            <FooterLink href="https://docz.site" target="_blank">
              <FooterLogo width={40} />
            </FooterLink>
          </Footer>
        </Content>
      </Wrapper>
      <ToggleBackground opened={hidden} onClick={handleSidebarToggle} />
    </Fragment>
  )
}
