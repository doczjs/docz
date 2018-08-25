import * as React from 'react'
import { Docs, Entry, DocsRenderProps } from 'docz'
import { Toggle, State } from 'react-powerplug'
import { Media } from 'react-breakpoints'
import { adopt } from 'react-adopt'
import styled from 'react-emotion'
import match from 'match-sorter'

import { Logo } from '../Logo'
import { Search } from '../Search'

import { Menu } from './Menu'
import { Link } from './Link'
import { Docz } from './Docz'
import { Hamburguer } from './Hamburguer'

interface WrapperProps {
  opened: boolean
  desktop: boolean
  theme?: any
}

const toggle = (p: WrapperProps) => (p.opened && !p.desktop ? '-90%' : '0')

const background = (p: WrapperProps) =>
  toggle(p) !== '0' ? 'transparent' : p.theme.docz.colors.sidebarBg

const position = (p: WrapperProps) =>
  p.theme.docz.mq({
    position: ['absolute', 'absolute', 'absolute', 'relative'],
  })

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 280px;
  min-width: 280px;
  height: 100%;
  background: ${background};
  transition: transform 0.2s, background 0.3s;
  transform: translateX(${toggle});
  z-index: 100;

  ${position};

  ${p => p.theme.docz.styles.sidebar};

  dl {
    padding: 0;
    margin: 0 0 0 16px;
  }

  dl a {
    font-weight: 400;
  }
`

const Menus = styled('nav')`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`

const Empty = styled('div')`
  flex: 1;
  opacity: 0.6;
  padding: 0 24px;
`

const Footer = styled('div')`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${p => p.theme.docz.colors.footerText};
  border-top: 1px dashed ${p => p.theme.docz.colors.border};
`

const FooterLink = styled('a')`
  padding: 0;
  margin: 0;
  margin-left: 5px;
`

interface OpenProps {
  opened: boolean
}

const ToggleBackground = styled('div')`
  content: '';
  display: ${(p: OpenProps) => (p.opened ? 'none' : 'block')};
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

const FooterLogo = styled(Docz)`
  fill: ${p => p.theme.docz.colors.footerText};
`

interface Media {
  breakpoints: any
  currentBreakpoint: string
}

interface Toggle {
  on: boolean
  toggle: () => void
}

interface State {
  setState: (state: any) => void
  state: {
    docs?: Entry[] | null
    searching?: boolean
    lastVal: string
  }
}

interface MapperProps {
  docs: DocsRenderProps
  media: Media
  toggle: Toggle
  state: State
}

type EnhancedProps = DocsRenderProps &
  Toggle &
  State & {
    media: Media
  }

const mapper = {
  docs: <Docs />,
  media: <Media />,
  state: <State initial={{ docs: null, searching: false, lastVal: '' }} />,
  toggle: <Toggle initial={true} />,
}

const mapProps = ({ docs, media, toggle, state }: MapperProps) => ({
  ...docs,
  ...toggle,
  ...state,
  media,
})

const Composed = adopt<EnhancedProps>(mapper, mapProps)

export const Sidebar = () => (
  <Composed>
    {({
      menus,
      docs: initialDocs,
      media,
      toggle,
      on,
      state,
      setState,
    }: EnhancedProps) => {
      const docs = state.docs || initialDocs
      const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
      const isDesktop = media.currentBreakpoint === 'desktop' ? true : false

      const fromMenu = (menu: string) => docs.filter(doc => doc.menu === menu)
      const search = (val: string) => {
        const change = !val.startsWith(state.lastVal)
        setState({
          lastVal: val,
        })
        if (change) return match(initialDocs, val, { keys: ['name'] })
        return match(docs, val, { keys: ['name'] })
      }

      const handleSearchDocs = (val: string) => {
        const isEmpty = val.length === 0

        setState({
          docs: isEmpty ? initialDocs : search(val),
          searching: !isEmpty,
        })
      }

      const handleSidebarToggle = (ev: React.SyntheticEvent<any>) => {
        if (isDesktop) return
        toggle && toggle()
      }

      return (
        <React.Fragment>
          <Wrapper opened={on} desktop={isDesktop}>
            <Hamburguer opened={!on} onClick={handleSidebarToggle} />
            <Logo showBg={!on} />
            <Search showing={isDesktop || !on} onSearch={handleSearchDocs} />
            {docs.length < 1 ? (
              <Empty>No documents find.</Empty>
            ) : (
              <Menus>
                {docsWithoutMenu.map(doc => (
                  <Link
                    key={doc.id}
                    to={doc.route}
                    onClick={handleSidebarToggle}
                    doc={doc}
                  >
                    {doc.name}
                  </Link>
                ))}
                {menus.map(menu => (
                  <Menu
                    key={menu}
                    menu={menu}
                    docs={fromMenu(menu)}
                    sidebarToggle={handleSidebarToggle}
                    collapseAll={Boolean(state.searching)}
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
          </Wrapper>
          <ToggleBackground opened={on} onClick={handleSidebarToggle} />
        </React.Fragment>
      )
    }}
  </Composed>
)
