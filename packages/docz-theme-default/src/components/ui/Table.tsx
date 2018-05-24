import styled from 'react-emotion'

export const Table = styled('table')`
  width: 100%;
  padding: 0;
  margin-bottom: 50px;
  table-layout: fixed;
  box-shadow: 0 0 0 1px ${p => p.theme.colors.border};
  background-color: transparent;
  border-radius: 3px;
  border-spacing: 0;
  border-collapse: collapse;
  border-style: hidden;
  font-size: 14px;

  & thead {
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
`
