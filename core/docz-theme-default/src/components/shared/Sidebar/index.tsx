import { jsx } from '@emotion/core'
import { Fragment, Component } from 'react'
import { Menu as DocsMenu, MenuItem } from 'docz'
import withSizes from 'react-sizes'
import styled from '@emotion/styled'
import match from 'match-sorter'
import flattendepth from 'lodash.flattendepth'

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

  ${get('styles.sidebar')};
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
  background: ${sidebarBg};
`

const Menus = styled('nav')`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`

const Empty = styled('div')`
  flex: 1;
  opacity: 0.7;
  padding: 0 24px;
  color: ${sidebarText};
`

const Footer = styled('div')`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${sidebarText};
  border-top: 1px dashed ${sidebarBorder};
`

const FooterLink = styled('a')`
  padding: 0;
  margin: 0;
  margin-left: 5px;
`

const FooterLogo = styled(Docz as any)<{ width: number }>`
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

interface SidebarState {
  menus: MenuItem[] | null
  searching: boolean
  lastVal: string
  hidden: boolean
}

interface SidebarProps {
  isDesktop: boolean
}

class SidebarBase extends Component<SidebarProps, SidebarState> {
  public state = {
    lastVal: '',
    menus: null,
    searching: false,
    hidden: true,
  }

  public componentDidUpdate(pProps: SidebarProps, pState: SidebarState): void {
    const { isDesktop } = this.props
    const { hidden } = this.state

    if (pState.hidden !== this.state.hidden) {
      this.toggleOverlayClass()
    }
    if (pProps.isDesktop !== isDesktop && !hidden && isDesktop) {
      this.setState({ hidden: true })
      this.removeOverlayClass()
    }
  }

  public componentDidMount(): void {
    this.toggleOverlayClass()
  }

  public render(): React.ReactNode {
    const { hidden } = this.state

    return (
      <DocsMenu>
        {initial => {
          const menus = this.state.menus || initial

          return (
            <Fragment>
              <Wrapper opened={hidden}>
                <Content>
                  <Hamburguer
                    opened={!hidden}
                    onClick={this.handleSidebarToggle}
                  />
                  <Logo showBg={!hidden} />
                  <Search onSearch={this.handleSearchDocs(initial, menus)} />

                  {menus.length === 0 ? (
                    <Empty>No documents found.</Empty>
                  ) : (
                    <Menus>
                      {menus.map(menu => (
                        <Menu
                          key={menu.id}
                          item={menu}
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
                opened={hidden}
                onClick={this.handleSidebarToggle}
              />
            </Fragment>
          )
        }}
      </DocsMenu>
    )
  }

  private toggleOverlayClass = () => {
    const { isDesktop } = this.props
    const { hidden } = this.state
    const method = !hidden ? this.addOverlayClass : this.removeOverlayClass

    if (window && typeof window !== 'undefined' && !isDesktop) {
      method()
    }
  }

  private removeOverlayClass(): void {
    document.documentElement!.classList.remove('with-overlay')
  }
  private addOverlayClass(): void {
    document.documentElement!.classList.add('with-overlay')
  }

  private match = (val: string, menu: MenuItem[]) => {
    const items = menu.map(item => [item].concat(item.menu || []))
    const flattened = flattendepth(items, 2)

    return match(flattened, val, { keys: ['name'] })
  }

  private search = (initial: MenuItem[], menus: MenuItem[], val: string) => {
    const change = !val.startsWith(this.state.lastVal)

    this.setState({ lastVal: val })
    return this.match(val, change ? initial : menus)
  }

  private handleSearchDocs = (initial: MenuItem[], menus: MenuItem[]) => (
    val: string
  ) => {
    const isEmpty = val.length === 0

    this.setState({
      menus: isEmpty ? initial : this.search(initial, menus, val),
      searching: !isEmpty,
    })
  }

  private handleSidebarToggle = () => {
    if (this.props.isDesktop) return
    this.setState({ hidden: !this.state.hidden })
  }
}

const mapSizesToProps = ({ width }: { width: number }) => ({
  isDesktop: width >= breakpoints.desktop,
})

export const Sidebar = withSizes(mapSizesToProps)(SidebarBase)
