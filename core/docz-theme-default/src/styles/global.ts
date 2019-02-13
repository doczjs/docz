import { createGlobalStyle } from 'styled-components'
import { get } from '@utils/theme'

export const Global = createGlobalStyle`
  .icon-link {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
    ${get('styles.body')};
  }

  .with-overlay {
    overflow: hidden;
  }

  html,
  body,
  #root {
    height: 100%;
    min-height: 100%;
  }
`
