export const theme = `
  code[class*="language-"],
  pre[class*="language-"] {
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    background: #f5f7ff;
    border-radius: 5px;
    color: #5e6687;
  }

  pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
  code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
    text-shadow: none;
    background: #dfe2f1;
  }

  pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
  code[class*="language-"]::selection, code[class*="language-"] ::selection {
    text-shadow: none;
    background: #dfe2f1;
  }

  /* Code blocks */
  pre[class*="language-"] {
    overflow: auto;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #898ea4;
  }

  .token.punctuation {
    color: #5e6687;
  }

  .token.namespace {
    opacity: .7;
  }

  .token.operator,
  .token.boolean,
  .token.number {
    color: #c76b29;
  }

  .token.property {
    color: #c08b30;
  }

  .token.tag {
    color: #3d8fd1;
  }

  .token.string {
    color: #22a2c9;
  }

  .token.selector {
    color: #6679cc;
  }

  .token.attr-name {
    color: #c76b29;
  }

  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #22a2c9;
  }

  .token.attr-value,
  .token.keyword,
  .token.control,
  .token.directive,
  .token.unit {
    color: #ac9739;
  }

  .token.statement,
  .token.regex,
  .token.atrule {
    color: #22a2c9;
  }

  .token.placeholder,
  .token.variable {
    color: #3d8fd1;
  }

  .token.deleted {
    text-decoration: line-through;
  }

  .token.inserted {
    border-bottom: 1px dotted #202746;
    text-decoration: none;
  }

  .token.italic {
    font-style: italic;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.important {
    color: #c94922;
  }

  .token.entity {
    cursor: help;
  }

  pre > code.highlight {
    outline: 0.4em solid #c94922;
    outline-offset: .4rem;
  }

  /* overrides color-values for the Line Numbers plugin
  * http://prismjs.com/plugins/line-numbers/
  */
  .line-numbers .line-numbers-rows {
    border-right-color: #dfe2f1;
  }

  .line-numbers-rows > span:before {
    color: #979db4;
  }

  /* overrides color-values for the Line Highlight plugin
  * http://prismjs.com/plugins/line-highlight/
  */
  .line-highlight {
    background: rgba(107, 115, 148, 0.2);
    background: -webkit-linear-gradient(left, rgba(107, 115, 148, 0.2) 70%, rgba(107, 115, 148, 0));
    background: linear-gradient(to right, rgba(107, 115, 148, 0.2) 70%, rgba(107, 115, 148, 0));
  }
`
