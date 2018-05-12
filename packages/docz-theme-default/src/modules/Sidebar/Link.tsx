import React, { SFC } from 'react'
import { NavLink as BaseLink, LinkProps, match } from 'react-router-dom'
import { Location } from 'history'
import styled from 'react-emotion'

import * as colors from '../../styles/colors'

const LinkStyled = styled(BaseLink)`
  position: relative;
  display: block;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 400;
  color: white;
  background: transparent;
  border-radius: 3px;
  transition: background 0.3s;

  &,
  &:visited {
    color: ${colors.silver};
  }

  &.active {
    background: ${colors.darkSnow};
  }

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${colors.purple};
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.3s;
  }

  &:hover::before,
  &.active:before {
    transform: scaleX(1);
  }
`

const isActive = (match: match<any>, location: Location) =>
  match && match.url === location.pathname

export const Link: SFC<LinkProps> = props => (
  <LinkStyled isActive={isActive} {...props} />
)
