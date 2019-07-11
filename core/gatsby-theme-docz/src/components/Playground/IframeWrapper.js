/** @jsx jsx */
import { jsx } from 'theme-ui'
import { createPortal } from 'react-dom'
import { useEffect, useState, useRef } from 'react'
import { get } from 'lodash/fp'

const styles = {
  iframe: (showingCode, height = 'auto') => ({
    height,
    display: 'block',
    minHeight: '100%',
    width: 'calc(100% - 2px)',
    border: t => `1px solid ${t.colors.playground.border}`,
    borderRadius: showingCode ? '4px 4px 0 0' : '4px',
  }),
}

export const IframeWrapper = ({ children, showingCode }) => {
  const ref = useRef()
  const [container, setContainer] = useState(null)
  const [height, setHeight] = useState()
  const iframeNode = get('current', ref)

  const bodyStyles = iframeNode => {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(''))
    style.textContent = 'html,body { height: 100%; }'
    iframeNode.contentDocument.head.appendChild(style)
  }

  const copyStyles = iframeNode => {
    const links = Array.from(document.getElementsByTagName('link'))
    const styles = Array.from(document.head.getElementsByTagName('style'))

    links.forEach(link => {
      if (link.rel === 'stylesheet') {
        iframeNode.contentDocument.head.appendChild(link.cloneNode(true))
      }
    })
    styles.forEach(style => {
      iframeNode.contentDocument.head.appendChild(style.cloneNode(true))
    })
  }

  const handleLoad = () => {
    const iframeNode = ref.current
    const body = get('contentDocument.body', iframeNode)
    if (body) {
      setContainer(body)
      copyStyles(iframeNode)
      bodyStyles(iframeNode)
      getHeightFromChild(iframeNode)
    }
  }

  const getChild = iframeNode => {
    return get('contentDocument.body.children', iframeNode)
  }

  const getHeightFromChild = iframeNode => {
    const child = getChild(iframeNode)
    child && child.length > 0 && setHeight(child[0].offsetHeight)
  }

  useEffect(() => {
    const iframeNode = ref.current
    if (!iframeNode) return
    iframeNode.addEventListener('load', handleLoad)
    return () => iframeNode.removeEventListener('load', handleLoad)
  }, [ref])

  return (
    <iframe
      ref={ref}
      sx={styles.iframe(showingCode, height)}
      sandbox="allow-same-origin"
      srcDoc={'<!DOCTYPE html>'}
    >
      {container &&
        iframeNode &&
        iframeNode.contentDocument &&
        createPortal(children, container)}
    </iframe>
  )
}
