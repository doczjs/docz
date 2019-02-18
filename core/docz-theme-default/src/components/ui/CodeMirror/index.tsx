import * as React from 'react'
import { SFC } from 'react'
import { useConfig } from 'docz'
import { Controlled as BaseCodeMirror } from 'react-codemirror2'
import PerfectScrollbar from 'react-perfect-scrollbar'
import styled from 'styled-components'

import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

import { ScrollbarStyles } from './ps-scrollbar'
import * as themes from './themes'

import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/fold/xml-fold'

const Scrollbar = styled(PerfectScrollbar)`
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
  ${themes.dark};
  ${themes.light};
  position: relative;
  flex: 1;
  font-size: 16px;
  ${p => mq(preStyles(p))};

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

const CodeMirror: SFC<any> = props => {
  const { themeConfig } = useConfig()
  const linesToScroll = themeConfig.linesToScrollEditor || 14
  return (
    <React.Fragment>
      <ScrollbarStyles />
      <Scrollbar option={scrollbarOpts} linesToScroll={linesToScroll}>
        <EditorStyled {...props} />
      </Scrollbar>
    </React.Fragment>
  )
}

export default CodeMirror
