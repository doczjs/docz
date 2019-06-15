import { css } from '@emotion/core'
import { get } from '~utils/theme'

export const styles = (p: any) => ({
  body: css`
    font-family: ${get('fonts.ui')(p)};
    font-size: 16px;
    line-height: 1.6;
  `,
  h1: css`
    margin: 40px 0 20px;
    font-family: ${get('fonts.display')(p)};
    font-size: 48px;
    font-weight: 600;
    letter-spacing: -0.02em;
  `,
  h2: css`
    margin: 30px 0 15px;
    line-height: 1.4em;
    font-family: ${get('fonts.display')(p)};
    font-weight: 500;
    font-size: 28px;
    letter-spacing: -0.02em;
  `,
  h3: css`
    margin: 25px 0 10px;
    font-size: 20px;
    font-weight: 400;
  `,
  h4: css`
    margin: 25px 0 10px;
    font-size: 16px;
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
    padding: 40px;
  `,
  code: css`
    margin: 0 3px;
    border-radius: 3px;
    font-family: ${get('fonts.mono')(p)};
    padding: 2px 5px;
    font-size: 0.8em;
    border: '1px solid rgba(0, 0, 0, 0.02)';
  `,
  pre: css`
    font-family: ${get('fonts.mono')(p)};
    font-size: 1em;
    line-height: 1.8;
  `,
  paragraph: css`
    margin: 10px 0 20px 0;
  `,
  table: css`
    overflow-y: hidden;
    width: 100%;
    font-family: ${get('fonts.mono')(p)};
    font-size: 16px;
    overflow-x: initial;
    display: block;
  `,
  blockquote: css`
    margin: 25px 0;
    padding: 20px;
    font-style: italic;
    font-size: 16px;
  `,
})
