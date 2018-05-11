import styled from 'react-emotion'
import { rem } from 'polished'

import * as colors from '../styles/colors'

export const Table = styled('table')`
  width: 100%;
  padding: 0;
  margin-bottom: ${rem(50)};
  table-layout: fixed;
  box-shadow: 0 0 0 1px ${colors.border};
  background-color: transparent;
  border-radius: 3px;
  border-spacing: 0;
  border-collapse: collapse;
  border-style: hidden;
  font-size: ${rem(14)};

  & thead {
    background: ${colors.darkSnow};
  }

  & thead th {
    text-align: left;
    font-weight: 400;
    padding: ${rem(20)} ${rem(20)};
  }

  & tbody td {
    padding: ${rem(12)} ${rem(20)};
    line-height: 2;
    font-weight: 200;
  }

  & tbody > tr {
    display: table-row;
    border-top: 1px solid ${colors.border};
  }
`
