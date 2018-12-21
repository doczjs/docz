import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import styled from '@emotion/styled'
import { css } from '@emotion/core'

import { get } from '@utils/theme'

export const HANDLE_SIZE = '20px'

interface HandleProps {
  full: boolean
  horizontal: boolean
  theme?: any
}

const borderColor = get('colors.border')
const preBg = get('colors.preBg')
const mode = get('mode')

const line = (position: string) => (p: HandleProps) => css`
  content: '';
  position: absolute;
  display: block;
  top: ${p.horizontal ? '50%' : position};
  left: ${p.horizontal ? position : '50%'};
  width: ${p.horizontal ? '2px' : '25px'};
  height: ${p.horizontal ? '25px' : '2px'};
  background: ${mode(p) === 'light'
    ? darken(0.05, borderColor(p))
    : lighten(0.06, borderColor(p))};
  transform: translate(-50%, -50%);
`

const whenHorizontal = (on: any, off: any) => (p: HandleProps) =>
  p.horizontal ? on : off

const handleHeight = (p: HandleProps) =>
  p.horizontal ? `calc(100% ${p.full ? '+ 3px' : '- 2px'})` : HANDLE_SIZE

export const Handle = styled('div')<HandleProps>`
  z-index: ${p => (p.full ? (p.horizontal ? 9999 : 9998) : 9)};
  position: absolute;
  display: block;
  width: ${whenHorizontal(HANDLE_SIZE, 'calc(100% + 3px)')};
  height: ${handleHeight};
  border: 1px solid ${p => lighten(0.03, borderColor(p))};
  border-radius: ${whenHorizontal('0 4px 4px 0', '0 0 4px 4px')};
  background: ${p => darken(0.01, preBg(p))};

  ${whenHorizontal(
    `
      top: 0;
      right: 0;
    `,
    `
      bottom: 0;
      left: 0;
    `
  )};

  &:after {
    ${line('calc(50% + 3px)')};
  }

  &:before {
    ${line('calc(50% - 3px)')};
  }
`
