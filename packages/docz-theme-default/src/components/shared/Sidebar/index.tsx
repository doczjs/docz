import * as React from 'react'
import { Docs, Entry, ThemeConfig, DocsRenderProps } from 'docz'
import { Toggle, State } from 'react-powerplug'
import { Media } from 'react-breakpoints'
import { adopt } from 'react-adopt'
import styled from 'react-emotion'
import Fuse from 'fuse.js'

import { Menu } from './Menu'
import { Link } from './Link'
import { Docz } from './Docz'
import { Hamburguer } from './Hamburguer'
import { Search } from './Search'

interface Wrapper {
  opened: boolean
  desktop: boolean
  theme?: any
}

interface OpenProps {
  opened: boolean
}

const toggle = (p: Wrapper) => (p.opened && !p.desktop ? '-90%' : '0')
const background = (p: Wrapper) =>
  toggle(p) !== '0' ? 'transparent' : p.theme.colors.sidebarBg

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  height: 100%;
  background: ${background};
  transition: transform 0.2s, background 0.3s;
  transform: translateX(${toggle});
  z-index: 100;

  ${p =>
    p.theme.mq({
      position: ['absolute', 'absolute', 'absolute', 'relative'],
    })};

  ${p => p.theme.styles.sidebar};

  dl {
    padding: 0;
    margin: 0 0 0 16px;
  }

  dl a {
    font-weight: 400;
  }
`

const logoMarginBottom = (p: any) =>
  p.theme.mq({
    marginBottom: ['30px', '45px'],
  })

const LogoImg = styled('img')`
  margin: 30px;
  padding: 0;

  ${logoMarginBottom};
`

const LogoText = styled('h1')`
  position: relative;
  margin: 30px;
  padding: 0;
  font-size: 26px;
  color: ${p => p.theme.colors.text};

  ${logoMarginBottom};

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 15%;
    height: 3px;
    background: ${p => p.theme.colors.primary};
  }
`

const Menus = styled('nav')`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;

  ${p =>
    p.theme.mq({
      paddingLeft: [10, 20],
      paddingRight: [10, 20],
    })};
`

const Footer = styled('div')`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${p => p.theme.colors.footerText};
  border-top: 1px dashed ${p => p.theme.colors.border};
`

const FooterLink = styled('a')`
  padding: 0;
  margin: 0;
  margin-left: 5px;
`

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
  fill: ${p => p.theme.colors.footerText};
`

interface Media {
  breakpoints: any
  currentBreakpoint: string
}

interface Toggle {
  on: boolean
  toggle: () => void
}

interface Config {
  title: string
  logo: { src: string; width: any }
}

interface State {
  setState: (state: any) => void
  state: {
    docs?: Entry[] | null
    searching?: boolean
  }
}

interface MapperProps {
  docs: DocsRenderProps
  media: Media
  toggle: Toggle
  config: Config
  state: State
}

type EnhancedProps = DocsRenderProps &
  Toggle &
  State & {
    media: Media
    config: Config
  }

const getSearch = (docs: Entry[]) => (val: string): Entry[] => {
  const options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
  }

  const fuse = new Fuse(docs, options)
  return fuse.search(val)
}

const getMenusFromDocs = (docs: Entry[]): string[] => {
  return Array.from(
    new Set(
      docs.reduce(
        (arr: string[], doc: Entry): string[] =>
          doc.menu ? arr.concat([doc.menu]) : arr,
        []
      )
    )
  )
}

const mapper = {
  docs: <Docs />,
  media: <Media />,
  toggle: <Toggle initial={true} />,
  config: <ThemeConfig />,
  state: ({ docs, render }: any) => (
    <State initial={{ docs: null, searching: false }}>{render}</State>
  ),
}

const mapProps = ({ docs, media, toggle, config, state }: MapperProps) => ({
  ...docs,
  ...toggle,
  ...state,
  media,
  config,
})

const Composed = adopt<EnhancedProps>(mapper, mapProps)

export const Sidebar = () => (
  <Composed>
    {({
      docs: initialDocs,
      media,
      config,
      toggle,
      on,
      state,
      setState,
    }: EnhancedProps) => {
      const isDesktop = media.currentBreakpoint === 'desktop' ? true : false
      const title = config.title
      const logo = config.logo

      const docs = state.docs || initialDocs
      const search = getSearch(docs)
      const menus = getMenusFromDocs(docs)
      const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
      const fromMenu = (menu: string) => docs.filter(doc => doc.menu === menu)

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
            <Hamburguer opened={on} onClick={handleSidebarToggle} />
            {logo ? (
              <LogoImg src={logo.src} width={logo.width} alt={title} />
            ) : (
              <LogoText>{title}</LogoText>
            )}
            <Search showing={isDesktop || !on} onSearch={handleSearchDocs} />
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
