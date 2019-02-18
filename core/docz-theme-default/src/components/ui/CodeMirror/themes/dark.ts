import { css } from 'styled-components'

export const theme = css`
  .CodeMirror.cm-s-docz-dark {
    color: #d8dee9;
    background-color: #2e3440;
    border-radius: 0;
  }
  .cm-s-docz-dark .CodeMirror-selected {
    background-color: rgba(67, 76, 94, 0.8);
  }
  .cm-s-docz-dark .CodeMirror-gutter,
  .cm-s-docz-dark .CodeMirror-gutters {
    border: none;
    background-color: #2e3440;
    border-radius: 0;
  }
  .cm-s-docz-dark .CodeMirror-linenumber,
  .cm-s-docz-dark .CodeMirror-linenumbers {
    color: rgba(216, 222, 233, 0.4) !important;
    background-color: #2e3440;
  }
  .cm-s-docz-dark .CodeMirror-lines {
    color: #d8dee9 !important;
    background-color: transparent;
  }
  .cm-s-docz-dark .CodeMirror-cursor {
    border-left: 2px solid #d8dee9 !important;
  }
  /* addon: edit/machingbrackets.js & addon: edit/matchtags.js */
  .cm-s-docz-dark .CodeMirror-matchingbracket,
  .cm-s-docz-dark .CodeMirror-matchingtag {
    border-bottom: 2px solid #81a1c1;
    color: #d8dee9 !important;
    background-color: transparent;
  }
  .cm-s-docz-dark .CodeMirror-nonmatchingbracket {
    border-bottom: 2px solid #bf616a;
    color: #d8dee9 !important;
    background-color: transparent;
  }
  /* addon: fold/foldgutter.js */
  .cm-s-docz-dark .CodeMirror-foldmarker,
  .cm-s-docz-dark .CodeMirror-foldgutter,
  .cm-s-docz-dark .CodeMirror-foldgutter-open,
  .cm-s-docz-dark .CodeMirror-foldgutter-folded {
    border: none;
    text-shadow: none;
    color: #d8dee9 !important;
    background-color: transparent;
  }
  /* addon: selection/active-line.js */
  .cm-s-docz-dark .CodeMirror-activeline-background {
    background-color: rgba(67, 76, 94, 0.32);
  }
  /* basic syntax */
  .cm-s-docz-dark .cm-attribute {
    color: #8fbcbb;
  }
  .cm-s-docz-dark .cm-keyword {
    color: #81a1c1;
  }
  .cm-s-docz-dark .cm-def {
    color: #d8dee9;
  }
  .cm-s-docz-dark .cm-atom {
    color: #81a1c1;
  }
  .cm-s-docz-dark .cm-number {
    color: #b48ead;
  }
  .cm-s-docz-dark .cm-property {
    color: #d8dee9;
  }
  .cm-s-docz-dark .cm-qualifier {
    color: #88c0d0;
  }
  .cm-s-docz-dark .cm-variable,
  .cm-s-docz-dark .cm-variable-2 {
    color: #88c0d0;
  }
  .cm-s-docz-dark .cm-variable-3 {
    color: #d8dee9;
  }
  .cm-s-docz-dark .cm-string,
  .cm-s-docz-dark .cm-string-2 {
    color: #a3be8c;
  }
  .cm-s-docz-dark .cm-operator {
    color: #81a1c1;
  }
  .cm-s-docz-dark .cm-meta {
    color: #81a1c1;
  }
  .cm-s-docz-dark .cm-comment {
    color: #4c566a;
  }
  .cm-s-docz-dark .cm-error {
    color: #bf616a;
  }
  /* markdown */
  .cm-s-docz-dark .cm-header {
    color: #88c0d0;
  }
  .cm-s-docz-dark .cm-quote {
    color: #4c566a;
  }
  .cm-s-docz-dark .cm-link {
    color: #88c0d0;
    text-decoration: none;
  }
  .cm-s-docz-dark .cm-url {
    color: #d8dee9;
    text-decoration: underline;
  }
  .cm-s-docz-dark .cm-strong {
    font-weight: bold;
  }
  .cm-s-docz-dark .cm-em {
    font-style: italic;
  }
  /* diff */
  .cm-s-docz-dark .cm-negative {
    color: #bf616a;
  }
  .cm-s-docz-dark .cm-positive {
    color: #a3be8c;
  }
  /* html */
  .cm-s-docz-dark .cm-tag {
    color: #81a1c1;
  }
`
