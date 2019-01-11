import { jsx } from '@emotion/core'
import { SFC } from 'react'
import { ThemeConfig } from 'docz'
import { Controlled as BaseCodeMirror } from 'react-codemirror2'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from '@emotion/styled'

import * as themes from '@styles/codemirror'
import { get } from '@utils/theme'
import { global } from './ps-scrollbar'
import { mq } from '@styles/responsive'

import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/fold/xml-fold'

const Scrollbar = styled(PerfectScrollbar)<any>`
  overflow: auto;
  position: relative;
  max-height: ${p => 25 * p.linesToScroll}px;

  .ps__rail-y {
    z-index: 9;
    opacity: 0.4;
  }
`

const preStyles = get('styles.pre')
const EditorStyled = styled(BaseCodeMirror)`
  ${themes.dark()};
  ${themes.light()};
  ${p => mq(preStyles(p))};
  position: relative;
  flex: 1;

  .CodeMirror {
    max-width: 100%;
    height: 100%;
  }

  .CodeMirror pre {
    ${p => mq(preStyles(p))};
  }

  .CodeMirror-gutters {
    left: 1px !important;
  }

  .CodeMirror-lines {
    padding: 10px 0;
    box-sizing: content-box;
  }

  .CodeMirror-line {
    padding: 0 10px;
  }

  .CodeMirror-linenumber {
    padding: 0 7px 0 5px;
  }
`

const scrollbarOpts = {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20,
  suppressScrollX: true,
}

export const CodeMirror: SFC<any> = props => (
  <ThemeConfig>
    {({ themeConfig }) => (
      <Scrollbar
        option={scrollbarOpts}
        linesToScroll={themeConfig.linesToScrollEditor || 14}
      >
        {global}
        <EditorStyled {...props} />
      </Scrollbar>
    )}
  </ThemeConfig>
)
