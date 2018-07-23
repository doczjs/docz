import styled from 'react-emotion'

export const Table = styled('table')`
  width: 100%;
  padding: 0;
  table-layout: fixed;
  box-shadow: 0 0 0 1px ${p => p.theme.colors.border};
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
  border-style: hidden;
  border-radius: 5px;
  font-size: 14px;
  color: ${p => p.theme.colors.tableColor};

  ${p =>
    p.theme.mq({
      overflowY: ['hidden', 'hidden', 'hidden', 'initial'],
      display: ['block', 'block', 'block', 'table'],
    })};

  & thead {
    color: ${p => p.theme.colors.theadColor};
    background: ${p => p.theme.colors.theadBg};
  }

  & thead th {
    text-align: left;
    font-weight: 400;
    padding: 20px 20px;

    &:nth-child(1) {
      ${p =>
        p.theme.mq({
          width: ['20%', '20%', '20%', 'auto'],
        })};
    }

    &:nth-child(2) {
      ${p =>
        p.theme.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-child(3) {
      ${p =>
        p.theme.mq({
          width: ['10%', '10%', '10%', 'auto'],
        })};
    }

    &:nth-child(4) {
      ${p =>
        p.theme.mq({
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
    border-top: 1px solid ${p => p.theme.colors.border};
  }

  ${p => p.theme.mq(p.theme.styles.table)};
`
