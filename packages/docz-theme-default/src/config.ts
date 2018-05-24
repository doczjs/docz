import * as colors from './styles/colors'
import { prismTheme } from './styles/prism-theme'

export const config = {
  colors,
  prismTheme,
  styles: {
    inject: `
      @import url('https://fonts.googleapis.com/css?family=Fira+Mono');
      @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700');
    `,
    body: {
      fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
      codeFontFamily: "'Fira Mono', monospace",
      fontSize: '16px',
      lineHeight: 1.5,
    },
    sidebar: {
      padding: 20,
      width: 320,
      background: colors.grayLight,
    },
    container: {
      width: 960,
      padding: '50px 50px 100px',
    },
    h1: `
      position: relative;
      font-size: 48px;
      font-weight: 600;
      margin: 30px 0;

      &:before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        width: 10%;
        height: 3px;
        background: ${colors.primary};
      }
    `,
    h2: {
      margin: '50px 0 20px',
      fontSize: 32,
      fontWeight: 400,
    },
    h3: {
      margin: '30px 0 20px',
      fontSize: 24,
      fontWeight: 400,
    },
    h4: {
      fontSize: 20,
      fontWeight: 400,
    },
    h5: {
      fontSize: 18,
      fontWeight: 400,
    },
    h6: {
      fontSize: 16,
      fontWeight: 400,
    },
    pre: {
      border: `1px solid ${colors.border}`,
    },
    list: {
      padding: 0,
      margin: '10px 0 10px 20px',
    },
    playground: {
      padding: '2rem',
    },
    table: `
      width: 100%;
      padding: 0;
      margin-bottom: 50px;
      table-layout: fixed;
      box-shadow: 0 0 0 1px ${colors.border};
      background-color: transparent;
      border-radius: 3px;
      border-spacing: 0;
      border-collapse: collapse;
      border-style: hidden;
      font-size: 14px;

      & thead {
        background: ${colors.grayLight};
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
        border-top: 1px solid ${colors.border};
      }
    `,
    tooltip: {
      content: {
        backgroundColor: colors.main,
        color: colors.grayLight,
      },
      tooltip: {
        display: 'flex',
        alignItems: 'center',
        width: 220,
        maxWidth: 220,
        padding: 5,
        backgroundColor: colors.main,
        borderRadius: '3px',
        fontSize: 16,
      },
      arrow: {
        borderTop: `solid ${colors.main} 5px`,
      },
    },
  },
}
