import * as React from 'react'
import styled from '@emotion/styled'
import { jsx } from '@emotion/core'

import { get } from '@utils/theme'

const Wrapper = styled('div')`
  overflow-x: auto;
  padding: 2px;

  ${p =>
    p.theme.docz.mq({
      marginBottom: [20, 40],
      maxWidth: ['calc(100vw - 40px)', 'calc(100vw - 80px)', '100%'],
    })};
`

const TableStyled = styled('table')`
  padding: 0;
  table-layout: auto;
  box-shadow: 0 0 0 1px ${get('colors.border')};
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
  border-style: hidden;
  border-radius: ${get('radii')};
  font-size: 14px;
  color: ${get('colors.tableColor')};
  ${p => p.theme.docz.mq(p.theme.docz.styles.table)};

  & thead {
    color: ${get('colors.theadColor')};
    background: ${get('colors.theadBg')};
  }

  & thead th {
    font-weight: 400;
    padding: 20px 20px;

    &:nth-of-type(1) {
      ${p =>
        p.theme.docz.mq({
          width: ['20%', '20%', '20%', 'auto'],
        })};
    }

    &:nth-of-type(2) {
      ${p =>
        p.theme.docz.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-of-type(3) {
      ${p =>
        p.theme.docz.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-of-type(4) {
      ${p =>
        p.theme.docz.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-of-type(5) {
      ${p =>
        p.theme.docz.mq({
          width: ['20%', '20%', '20%', 'auto'],
        })};
    }
  }

  & tbody td {
    padding: 12px 20px;
    line-height: 2;
    font-weight: 200;
  }

  & tbody > tr {
    display: table-row;
    border-top: 1px solid ${get('colors.border')};
  }

  ${p => p.theme.docz.mq(p.theme.docz.styles.table)};
`

export const Table = (props: React.TableHTMLAttributes<any>) => (
  <Wrapper>
    <TableStyled {...props} />
  </Wrapper>
)
