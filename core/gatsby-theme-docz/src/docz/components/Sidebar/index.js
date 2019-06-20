/** @jsx jsx */
import React from 'react'
import { jsx, Box } from 'theme-ui'
import { Global } from '@emotion/core'

export const Sidebar = React.forwardRef((props, ref) => (
  <React.Fragment>
    {props.open && (
      <Box
        onClick={props.onClick}
        css={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <Global
          styles={{
            body: {
              overflow: 'hidden',
            },
          }}
        />
      </Box>
    )}
    <Box
      {...props}
      ref={ref}
      css={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        minWidth: 0,
        width: 256,
        flex: 'none',
        px: 3,
        py: 3,
        maxHeight: 'calc(100vh - 64px)',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        [props.fullwidth
          ? '@media screen'
          : '@media screen and (max-width: 39.99em)']: {
          bg: 'background',
          marginLeft: -256,
          transition: 'transform .2s ease-out',
          transform: props.open ? 'translateX(100%)' : 'translateX(0)',
        },
        ul: {
          listStyle: 'none',
          m: 0,
          p: 0,
        },
      }}
    >
      helo world
    </Box>
  </React.Fragment>
))
