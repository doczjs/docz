import React from 'react'
import { Docs, Link, Entry, ThemeConfig } from 'docz'
import styled from 'react-emotion'
import { Toggle } from 'react-powerplug'

import { Menu } from './Menu'
import logo from '../../../images/docz.svg'

interface Wrapper {
  opened: boolean
}

interface IconProps {
  opened: boolean
}

interface ToggleBlockProps {
  opened: boolean
}

interface ToggleBackgroundProps {
  opened: boolean
}

const wrapperToggle = (p: Wrapper) => (p.opened ? '-90%' : '0')
const IconFirst = (p: IconProps) => (p.opened ? '0px' : '12px')
const IconMiddle = (p: IconProps) => (p.opened ? '1' : '0')
const IconLast = (p: IconProps) => (p.opened ? '0px' : '-4px')
const IconRotate = (p: IconProps) => (p.opened ? '0deg' : '45deg')
const toggleBlockTranslateX = (p: ToggleBlockProps) =>
  p.opened ? '10px' : '-6px'
const toggleBlockTranslateY = (p: ToggleBlockProps) =>
  p.opened ? '4px' : '0px'
const toggleBackgroundAppear = (p: ToggleBackgroundProps) =>
  p.opened ? 'none' : 'block'

const Wrapper = styled('div')`
  ${p =>
    p.theme.mq({
      position: ['absolute', 'absolute', 'absolute', 'relative'],
    })};
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${p =>
    wrapperToggle(p) !== '0' ? p.theme.colors.white : p.theme.colors.grayLight};
  transition: transform 0.3s, background 0.3s;
  transform: translateX(${wrapperToggle});
  z-index: 100;

  ${p => p.theme.styles.sidebar};

  a {
    position: relative;
    display: block;
    padding: 6px 16px;
    font-weight: 600;
    color: ${p => p.theme.colors.main};
  }

  a:hover,
  a:visited {
    color: ${p => p.theme.colors.main};
  }

  a:hover,
  a.active {
    color: ${p => p.theme.colors.primary};
    font-weight: 600;
  }

  dl {
    padding: 0;
    margin: 0 0 0 20px;
  }

  dl a {
    font-weight: 400;
  }
`

const LogoImg = styled('img')`
  margin: 24px 16px 64px;
  padding: 0;
`

const LogoText = styled('h1')`
  position: relative;
  margin: 24px 16px 64px;
  padding: 0;
  font-size: 32px;

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
`

const Footer = styled('div')`
  padding: 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${p => p.theme.colors.grayDark};
  border-top: 1px dashed ${p => p.theme.colors.gray};

  a {
    padding: 0;
    margin-left: 5px;
  }
`

const ToggleBlock = styled('div')`
  ${p =>
    p.theme.mq({
      display: ['block', 'block', 'block', 'none'],
    })};
  position: absolute;
  width: 32px;
  height: 36px;
  top: 0;
  right: 0;
  cursor: pointer;
  transform: translateX(${toggleBlockTranslateX})
    translateY(${toggleBlockTranslateY});
  transition: transform 0.3s;
`

const ToggleBackground = styled('div')`
  content: '';
  display: ${toggleBackgroundAppear};
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 99;
`

const Icon = styled('div')`
  position: relative;
  width: 28px;
  height: 32px;
  margin: auto;

  & .icon__line {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    right: 0;
    background: ${p => p.theme.colors.main};
    transition: transform 0.3s, opacity 0.3s;
    & :nth-child(1) {
      top: 10px;
      transform: translateY(${IconFirst}) rotate(${IconRotate});
    }
    & :nth-child(2) {
      top: 18px;
      opacity: ${IconMiddle};
    }
    & :nth-child(3) {
      top: 26px;
      transform: translateY(${IconLast}) rotate(-${IconRotate});
    }
  }
`

export const Sidebar = () => (
  <Toggle initial={false}>
    {({ on, toggle }: any) => {
      const handleToggle = (ev: React.SyntheticEvent<any>) => {
        ev.preventDefault()
        toggle()
      }
      return (
        <Docs>
          {({ docs, menus }) => {
            const docsWithoutMenu = docs.filter((doc: Entry) => !doc.menu)
            const fromMenu = (menu: string) =>
              docs.filter(doc => doc.menu === menu)

            return (
              <React.Fragment>
                <Wrapper opened={on}>
                  <ToggleBlock opened={on} onClick={handleToggle}>
                    <Icon opened={on}>
                      <span className="icon__line" />
                      <span className="icon__line" />
                      <span className="icon__line" />
                    </Icon>
                  </ToggleBlock>
                  <ThemeConfig>
                    {({ title, logo }) =>
                      logo ? (
                        <LogoImg
                          src={logo.src}
                          width={logo.width}
                          alt={title}
                        />
                      ) : (
                        <LogoText>{title}</LogoText>
                      )
                    }
                  </ThemeConfig>
                  <Menus>
                    {docsWithoutMenu.map(doc => (
                      <Link key={doc.id} to={doc.route}>
                        {doc.name}
                      </Link>
                    ))}
                    {menus.map(menu => (
                      <Menu key={menu} menu={menu} docs={fromMenu(menu)} />
                    ))}
                  </Menus>
                  <Footer>
                    Built with
                    <a href="#" target="_blank">
                      <img src={logo} width={40} alt="Docz" />
                    </a>
                  </Footer>
                </Wrapper>
                <ToggleBackground opened={on} onClick={handleToggle} />
              </React.Fragment>
            )
          }}
        </Docs>
      )
    }}
  </Toggle>
)
