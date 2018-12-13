import { css } from '@emotion/core'

export const styles = css`
  @import url('https://unpkg.com/rc-tooltip@3.7.3/assets/bootstrap.css');
  @import url('https://unpkg.com/codemirror@5.42.0/lib/codemirror.css');

  .icon-link {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
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
