import { css } from 'styled-components'

export const styles = {
  body: css`
    font-family: 'Source Sans Pro', Helvetica, sans-serif;
    font-size: 20px;
    line-height: 1.6;
  `,
  h1: css`
    margin: 40px 0 30px;
    font-family: 'Playfair Display', serif;
    font-size: 60px;
    font-weight: 700;
    letter-spacing: -0.02em;
  `,
  h2: css`
    margin: 40px 0 20px;
    line-height: 1.4em;
    font-family: 'Poppins', serif;
    font-weight: 400;
    font-size: 32px;
    letter-spacing: -0.02em;
  `,
  h3: css`
    margin: 25px 0 10px;
    font-size: 22px;
    font-weight: 400;
  `,
  h4: css`
    margin: 25px 0 10px;
    font-size: 18px;
    font-weight: 400;
  `,
  h5: css`
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: 400;
  `,
  h6: css`
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: 400;
    text-transform: uppercase;
  `,
  ol: css`
    padding: 0;
    margin: 10px 0 10px;
  `,
  ul: css`
    padding: 0;
    margin: 10px 0 10px;
  `,
  playground: css`
    padding: 1.5em;
  `,
  code: css`
    margin: 0 3px;
    border-radius: 3px;
    font-family: 'Source Code Pro', monospace;
    padding: 2px 5px;
    font-size: 0.8em;
    border: '1px solid rgba(0, 0, 0, 0.02)';
  `,
  pre: css`
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    line-height: 1.8;
  `,
  paragraph: css`
    margin: 10px 0 20px 0;
  `,
  table: css`
    overflow-y: hidden;
    width: 100%;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    overflow-x: initial;
    display: block;
  `,
  blockquote: css`
    margin: 25px 0;
    padding: 20px;
    font-style: italic;
    font-size: 18px;
  `,
}
