import lighten from 'polished/lib/color/lighten'
import darken from 'polished/lib/color/darken'
import styled, { css } from 'react-emotion'

export const HANDLE_SIZE = '20px'

const line = (color: string, position: string, horizontal: boolean) => css`
  position: absolute;
  display: block;
  top: ${horizontal ? '50%' : position};
  left: ${horizontal ? position : '50%'};
  content: '';
  width: ${horizontal ? '2px' : '25px'};
  height: ${horizontal ? '25px' : '2px'};
  background: ${color};
  transform: translate(-50%, -50%);
`

interface HandleProps {
  full: boolean
  horizontal: boolean
}

const whenHorizontal = (on: any, off: any) => (p: HandleProps) =>
  p.horizontal ? on : off

const handleHeight = (p: HandleProps) =>
  p.horizontal ? `calc(100% + ${p.full ? '5px' : '0px'})` : HANDLE_SIZE

export const Handle = styled('div')`
  z-index: ${p => (p.full ? (p.horizontal ? 9999 : 9998) : 0)};
  position: absolute;
  display: block;
  width: ${whenHorizontal(HANDLE_SIZE, 'calc(100% + 5px)')};
  height: ${handleHeight};
  border: 1px solid ${p => lighten(0.03, p.theme.colors.border)};
  border-radius: ${whenHorizontal('0 4px 4px 0', '0 0 4px 4px')};
  background: ${p => darken(0.01, p.theme.colors.preBg)};

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
    ${p =>
      line(
        lighten(0.06, p.theme.colors.border),
        'calc(50% + 3px)',
        p.horizontal
      )};
  }

  &:before {
    ${p =>
      line(
        lighten(0.06, p.theme.colors.border),
        'calc(50% - 3px)',
        p.horizontal
      )};
  }
`
