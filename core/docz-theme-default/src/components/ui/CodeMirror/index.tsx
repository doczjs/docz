import * as React from 'react'
import { useEffect, useRef, SFC } from 'react'
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

const noCurrent = (val: any) => !val || !val.current

const CodeMirror: SFC<any> = props => {
  const { themeConfig } = useConfig()
  const editor = useRef<any>(null)
  const forceUpdateEditorTimeout = useRef(0)
  const previousEditor = useRef(0)
  const linesToScroll = themeConfig.linesToScrollEditor || 14

  const editorProps = {
    ...props,
    editorDidMount: (codemirror: any) => {
      props.editorDidMount && props.editorDidMount(codemirror)
      editor.current = codemirror
    },
  }

  const refreshCodeMirror = () => {
    if (noCurrent(editor)) return
    editor.current.refresh()
  }

  const clearForceUpdateCodeMirror = () => {
    if (noCurrent(forceUpdateEditorTimeout)) return
    clearTimeout(forceUpdateEditorTimeout.current)
  }

  const forceUpdateCodeMirror = () => {
    if (noCurrent(editor)) return
    clearForceUpdateCodeMirror()

    forceUpdateEditorTimeout.current = setTimeout(() => {
      const currentHeight = editor.current.getScrollInfo().height || 0
      const hasNoHeight = currentHeight <= 0

      // Don't refresh if no height (CodeMirror is not visible) or
      // Don't refresh if same height
      if (hasNoHeight || previousEditor === currentHeight) return
      refreshCodeMirror()
      previousEditor.current = editor.current.getScrollInfo().height || 0
    })
  }

  useEffect(() => {
    forceUpdateCodeMirror()
    return () => clearForceUpdateCodeMirror()
  }, [])

  return (
    <React.Fragment>
      <ScrollbarStyles />
      <Scrollbar option={scrollbarOpts} linesToScroll={linesToScroll}>
        <EditorStyled {...editorProps} />
      </Scrollbar>
    </React.Fragment>
  )
}

export default CodeMirror
