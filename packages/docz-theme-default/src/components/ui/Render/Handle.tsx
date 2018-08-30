import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import styled, { css } from 'react-emotion'

export const HANDLE_SIZE = '20px'

interface HandleProps {
  full: boolean
  horizontal: boolean
  theme?: any
}

const line = (position: string) => (p: HandleProps) => css`
  content: '';
  position: absolute;
  display: block;
  top: ${p.horizontal ? '50%' : position};
  left: ${p.horizontal ? position : '50%'};
  width: ${p.horizontal ? '2px' : '25px'};
  height: ${p.horizontal ? '25px' : '2px'};
  background: ${p.theme.docz.mode === 'light'
    ? darken(0.05, p.theme.docz.colors.border)
    : lighten(0.06, p.theme.docz.colors.border)};
  transform: translate(-50%, -50%);
`

const whenHorizontal = (on: any, off: any) => (p: HandleProps) =>
  p.horizontal ? on : off

const handleHeight = (p: HandleProps) =>
  p.horizontal ? `calc(100% + ${p.full ? '5px' : '0px'})` : HANDLE_SIZE

export const Handle = styled('div')`
  z-index: ${p => (p.full ? (p.horizontal ? 9999 : 9998) : 9)};
  position: absolute;
  display: block;
  width: ${whenHorizontal(HANDLE_SIZE, 'calc(100% + 5px)')};
  height: ${handleHeight};
  border: 1px solid ${p => lighten(0.03, p.theme.docz.colors.border)};
  border-radius: ${whenHorizontal('0 4px 4px 0', '0 0 4px 4px')};
  background: ${p => darken(0.01, p.theme.docz.colors.preBg)};

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
