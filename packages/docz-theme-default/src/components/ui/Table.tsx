import { darken } from 'polished'
import styled from 'react-emotion'

export const Table = styled('table')`
  width: 100%;
  padding: 0;
  margin-bottom: 50px;
  table-layout: fixed;
  box-shadow: 0 0 0 1px ${p => p.theme.colors.border};
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
  border-style: hidden;
  font-size: 14px;
  color: ${p => p.theme.colors.grayDark};

  & thead {
    color: ${p => darken(0.2, p.theme.colors.grayDark)};
    background: ${p => p.theme.colors.grayLight};
  }

  & thead th {
    text-align: left;
    font-weight: 400;
    padding: 20px 20px;
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

  ${p => p.theme.styles.table};
`
