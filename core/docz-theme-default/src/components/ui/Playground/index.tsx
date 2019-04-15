import * as React from 'react'
import { SFC, Fragment } from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useConfig, PlaygroundProps as BasePlaygroundProps } from 'docz'
import { LiveProvider, LiveError, LivePreview } from 'react-live'
import styled, { css } from 'styled-components'
import rgba from 'polished/lib/color/rgba'
import Resizable from 're-resizable'
import getter from 'lodash/get'

import { Storage } from '@utils/storage'
import { get as themeGet } from '@utils/theme'

import { ResizeBar } from './ResizeBar'
import { ActionsBar } from './ActionsBar'
import { Handle, HANDLE_SIZE } from './Handle'
import { Editor as PreBase } from '../Editor'
import { useHotkeys } from '@utils/hotkeys'

interface OverlayProps {
  full: boolean
}

const whenFullscreen = (on: any, off: any) => (p: OverlayProps) =>
  p.full ? on : off

const Overlay = styled.div<OverlayProps>`
  top: 0;
  left: 0;
  z-index: ${whenFullscreen(9999, 0)};
  position: ${whenFullscreen('fixed', 'relative')};
  width: ${whenFullscreen('100vw', 'auto')};
  height: ${whenFullscreen('100vh', 'auto')};
  padding: ${whenFullscreen('60px 20px 20px', '0px')};
  margin: ${whenFullscreen('0px', '0 0 30px')};
  background: ${whenFullscreen('rgba(0,0,0,0.5)', 'transparent')};
  box-sizing: border-box;
  transition: background 0.3s;
`

const borderColor = themeGet('colors.border')
const minusHandleSize = `calc(100% - ${HANDLE_SIZE} + 4px)`

const Wrapper = styled.div<OverlayProps>`
  display: flex;
  flex-direction: column;
  height: ${whenFullscreen(minusHandleSize, '100%')};
  width: ${minusHandleSize};
  border: 1px solid ${borderColor};
`

const backgroundColor = themeGet('colors.background')

const PreviewWrapper = styled.div<OverlayProps>`
  position: relative;
  flex: 1;
  border-bottom: 1px solid ${borderColor};
  background: ${backgroundColor};
  min-height: ${whenFullscreen('198px', 'auto')};
`

const StyledPreviewWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  ${themeGet('styles.playground')};
`

const StyledError = styled(LiveError)`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  padding: 20px;
  margin: 0;
  background: ${rgba('black', 0.8)};
  font-size: 16px;
  color: white;
`

const Pre: any = styled(PreBase)`
  box-sizing: content-box;
  width: calc(100% - 2px);
  border-radius: 0 !important;
  border-bottom: 0;
  border-left: 0;
  margin: 0;
`

const editorStyle = css`
  border-top: 0;
`

const fromStorage = (storage: Storage) => (key: string, defaultValue: any) => {
  const obj = storage.get()
  return obj ? getter(obj, key) : defaultValue
}

export interface PlaygroundProps extends BasePlaygroundProps {
  showEditor?: boolean
}

export const Playground: SFC<PlaygroundProps> = ({
  position,
  code: initialCode,
  codesandbox,
  className,
  style,
  scope,
  wrapper: CustomWrapper = Fragment,
}) => {
  const { themeConfig, native } = useConfig()
  const initialShowEditor = getter(themeConfig, 'showPlaygroundEditor')
  const storage = useMemo(() => new Storage(`doczPlayground-${position}`), [])
  const atPos = fromStorage(storage)
  const initialFullscreen = atPos('fullscreen', false)
  const initialWidth = atPos('width', '100%')
  const initialHeight = atPos('height', '100%')

  const [key, setKey] = useState(0)
  const [code, setCode] = useState(initialCode)
  const [fullscreen, setFullscreen] = useState(() => initialFullscreen)
  const [width, setWidth] = useState(() => initialWidth)
  const [height, setHeight] = useState(() => initialHeight)
  const [showEditor, setShowEditor] = useState(() => Boolean(initialShowEditor))

  const state = {
    fullscreen,
    width,
    height,
    code,
    key,
    showEditor,
  }

  const resizableProps = useMemo(
    () => ({
      minHeight: fullscreen ? 360 : '100%',
      minWidth: 260,
      maxWidth: '100%',
      maxHeight: '100%',
      size: {
        width,
        height,
      },
      style: {
        margin: '0 auto ',
      },
      enable: {
        top: false,
        right: true,
        bottom: fullscreen,
        left: false,
        topRight: false,
        bottomRight: fullscreen,
        bottomLeft: false,
        topLeft: false,
      },
      handleComponent: {
        right: () => <Handle full={fullscreen} horizontal />,
        bottom: () => <Handle full={fullscreen} horizontal={false} />,
      },
      onResizeStop: (e: any, direction: any, ref: any, d: any) => {
        const width = ref.style.width
        const height = ref.style.height
        handleSetSize(width, height)
      },
    }),
    [fullscreen, width, height]
  )

  const editorProps = {
    css: editorStyle,
    actions: <Fragment />,
  }

  const setStorageProp = useCallback((fullscreen: boolean) => {
    storage.set({ ...state, fullscreen })
  }, [])

  const handleToggleFullscreen = () => {
    if (fullscreen) storage.delete()
    else setStorageProp(true)

    setFullscreen(atPos('fullscreen', false))
    setWidth(atPos('width', '100%'))
    setHeight(atPos('width', '100%'))
  }

  const handleToggleShowEditor = useCallback(() => {
    setShowEditor(s => !s)
  }, [])

  const handleSetSize = useCallback((width: string, height: string) => {
    const current = atPos('fullscreen', false)
    setWidth(width)
    setHeight(height)
    setStorageProp(current)
  }, [])

  const handleRefresh = useCallback(() => {
    setKey(key + 1)
  }, [])

  const transformCode = useCallback(
    (code: string) => {
      if (code.startsWith('()') || code.startsWith('class')) return code
      return `<React.Fragment>${code}</React.Fragment>`
    },
    [code]
  )

  const codesandboxUrl = useCallback(
    (native: boolean): string => {
      const url = 'https://codesandbox.io/api/v1/sandboxes/define'
      return `${url}?parameters=${codesandbox}${native ? `&editorsize=75` : ``}`
    },
    [codesandbox, native]
  )

  const unloadListener = useCallback(() => {
    storage.delete()
  }, [])

  const addUnloadListener = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', unloadListener, false)
    }
  }, [])

  const removeUnloadListener = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', unloadListener, false)
    }
  }, [])

  useEffect(() => {
    addUnloadListener()
    return () => removeUnloadListener()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const method = fullscreen ? 'add' : 'remove'
      document.body.classList[method]('with-overlay')
    }
  }, [fullscreen])

  useHotkeys('esc', () => {
    fullscreen && handleToggleFullscreen()
  })

  return (
    <LiveProvider code={code} scope={scope} transformCode={transformCode}>
      <Overlay full={fullscreen}>
        {fullscreen ? <ResizeBar onChangeSize={handleSetSize} /> : null}
        <Resizable {...resizableProps}>
          <Wrapper full={fullscreen}>
            <PreviewWrapper full={fullscreen}>
              <StyledPreviewWrapper>
                <CustomWrapper>
                  <LivePreview className={className} style={style} />
                </CustomWrapper>
              </StyledPreviewWrapper>
              <StyledError />
            </PreviewWrapper>
            <ActionsBar
              {...{ fullscreen, showEditor, code }}
              codesandboxUrl={codesandboxUrl(native)}
              onClickRefresh={handleRefresh}
              onClickEditor={handleToggleShowEditor}
              onClickFullscreen={handleToggleFullscreen}
            />
            {showEditor && (
              <Pre {...editorProps} onChange={setCode} readOnly={false}>
                {code}
              </Pre>
            )}
          </Wrapper>
        </Resizable>
      </Overlay>
    </LiveProvider>
  )
}
