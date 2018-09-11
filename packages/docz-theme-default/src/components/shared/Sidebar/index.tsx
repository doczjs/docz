import * as React from 'react'
import { Component } from 'react'
import { Docs, Entry } from 'docz'
import withSizes from 'react-sizes'
import styled from 'react-emotion'
import match from 'match-sorter'

import { Logo } from '../Logo'
import { Search } from '../Search'

import { Menu } from './Menu'
import { Link } from './Link'
import { Docz } from './Docz'
import { Hamburguer } from './Hamburguer'
import { breakpoints } from '../../../styles/responsive'

interface WrapperProps {
  opened: boolean
  theme?: any
}

const position = (p: WrapperProps) =>
  p.theme.docz.mq({
    position: ['absolute', 'absolute', 'absolute', 'relative'],
  })

const Wrapper = styled('div')`
  position: relative;
  width: 280px;
  min-width: 280px;
  min-height: 100vh;
  background: ${(p: WrapperProps) => p.theme.docz.colors.sidebarBg};
  transition: transform 0.2s, background 0.3s;
  z-index: 100;
  ${position};

  ${p => p.theme.docz.styles.sidebar};

  dl {
    padding: 0;
    margin: 0 16px;
  }

  dl a {
    font-weight: 400;
  }

  @media screen and (max-width: ${breakpoints.desktop - 1}px) {
    transform: translateX(${(p: WrapperProps) => (p.opened ? '-100%' : '0')});
  }
`

const Content = styled('div')`
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

interface SidebarState {
  docs: Entry[] | null
  searching: boolean
  lastVal: string
  showing: boolean
}

interface SidebarProps {
  isDesktop: boolean
}

class SidebarBase extends Component<SidebarProps, SidebarState> {
  public state = {
    docs: null,
    lastVal: '',
    searching: false,
    showing: true,
  }

  public componentDidUpdate(pProps: SidebarProps, pState: SidebarState): void {
    if (pState.showing !== this.state.showing) {
      this.addOverlayClass()
    }
  }

  public componentDidMount(): void {
    this.addOverlayClass()
  }

  public render(): React.ReactNode {
    const { showing } = this.state

    return (
      <Docs>
        {({ menus, docs: initialDocs }) => {
          const docs = this.state.docs || initialDocs
          const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)

          return (
            <React.Fragment>
              <Wrapper opened={showing}>
                <Content>
                  <Hamburguer
                    opened={!showing}
                    onClick={this.handleSidebarToggle}
                  />
                  <Logo showBg={!showing} />
                  <Search onSearch={this.handleSearchDocs(initialDocs, docs)} />
                  {docs.length < 1 ? (
                    <Empty>No documents found.</Empty>
                  ) : (
                    <Menus>
                      {docsWithoutMenu.map(doc => (
                        <Link
                          key={doc.id}
                          to={doc.route}
                          onClick={this.handleSidebarToggle}
                          doc={doc}
                        >
                          {doc.name}
                        </Link>
                      ))}
                      {menus.map(menu => (
                        <Menu
                          key={menu}
                          menu={menu}
                          docs={this.fromMenu(docs, menu)}
                          sidebarToggle={this.handleSidebarToggle}
                          collapseAll={Boolean(this.state.searching)}
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
              <ToggleBackground
                opened={showing}
                onClick={this.handleSidebarToggle}
              />
            </React.Fragment>
          )
        }}
      </Docs>
    )
  }

  private addOverlayClass = () => {
    const { isDesktop } = this.props
    const { showing } = this.state

    if (window && typeof window !== 'undefined' && !isDesktop) {
      !showing && document.documentElement.classList.add('with-overlay')
      showing && document.documentElement.classList.remove('with-overlay')
    }
  }

  private fromMenu = (docs: Entry[], menu: string) => {
    return docs.filter(doc => doc.menu === menu)
  }

  private search = (initialDocs: Entry[], docs: Entry[], val: string) => {
    const change = !val.startsWith(this.state.lastVal)

    this.setState({ lastVal: val })
    if (change) return match(initialDocs, val, { keys: ['name'] })
    return match(docs, val, { keys: ['name'] })
  }

  private handleSearchDocs = (initialDocs: Entry[], docs: Entry[]) => (
    val: string
  ) => {
    const isEmpty = val.length === 0

    this.setState({
      docs: isEmpty ? initialDocs : this.search(initialDocs, docs, val),
      searching: !isEmpty,
    })
  }

  private handleSidebarToggle = () => {
    if (this.props.isDesktop) return
    this.setState({ showing: !this.state.showing })
  }
}

const mapSizesToProps = ({ width }: { width: number }) => ({
  isDesktop: width >= breakpoints.desktop,
})

export const Sidebar = withSizes(mapSizesToProps)(SidebarBase)
