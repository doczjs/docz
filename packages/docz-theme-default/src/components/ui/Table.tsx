import * as React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  overflow-x: auto;
  padding: 2px;

  ${p =>
    p.theme.docz.mq({
      maxWidth: ['calc(100vw - 40px)', 'calc(100vw - 80px)', '100%'],
    })};
`

const TableStyled = styled('table')`
  padding: 0;
  table-layout: auto;
  box-shadow: 0 0 0 1px ${p => p.theme.docz.colors.border};
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
  border-style: hidden;
  border-radius: 5px;
  font-size: 14px;
  color: ${p => p.theme.docz.colors.tableColor};
  ${p => p.theme.docz.mq(p.theme.docz.styles.table)};

  & thead {
    color: ${p => p.theme.docz.colors.theadColor};
    background: ${p => p.theme.docz.colors.theadBg};
  }

  & thead th {
    text-align: left;
    font-weight: 400;
    padding: 20px 20px;

    &:nth-child(1) {
      ${p =>
        p.theme.docz.mq({
          width: ['20%', '20%', '20%', 'auto'],
        })};
    }

    &:nth-child(2) {
      ${p =>
        p.theme.docz.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-child(3) {
      ${p =>
        p.theme.docz.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-child(4) {
      ${p =>
        p.theme.docz.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-child(5) {
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
    border-top: 1px solid ${p => p.theme.docz.colors.border};
  }

  ${p => p.theme.docz.mq(p.theme.docz.styles.table)};
`

export const Table = (props: React.TableHTMLAttributes<any>) => (
  <Wrapper>
    <TableStyled {...props} />
  </Wrapper>
)
