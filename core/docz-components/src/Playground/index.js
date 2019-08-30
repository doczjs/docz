/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useState } from 'react';
import { useConfig } from 'docz';
import { LiveProvider, LiveError, LivePreview, LiveEditor } from 'react-live';
import { merge } from 'lodash/fp';
import { Resizable } from 're-resizable';
import copy from 'copy-text-to-clipboard';

import { usePrismTheme } from '~utils/theme';
import { LivePreviewWrapper } from './LivePreviewWrapper';
import * as styles from './styles';
import * as Icons from '../Icons';

export const Playground = ({ code, scope }) => {
  const {
    themeConfig: { showPlaygroundEditor, showLiveError },
  } = useConfig();

  const theme = usePrismTheme();
  const [showingCode, setShowingCode] = useState(() => showPlaygroundEditor);
  const [width, setWidth] = useState(() => '100%');

  const transformCode = code => {
    if (code.startsWith('()') || code.startsWith('class')) return code;
    return `<React.Fragment>${code}</React.Fragment>`;
  };

  const toggleCode = () => {
    setShowingCode(s => !s);
  };

  const resizableProps = {
    minWidth: 260,
    maxWidth: '100%',
    size: {
      width,
    },
    style: {
      margin: '0 auto ',
    },
    enable: {
      top: false,
      right: true,
      bottom: false,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false,
    },
    onResizeStop: (e, direction, ref) => {
      setWidth(ref.style.width);
    },
  };

  return (
    <Resizable {...resizableProps}>
      <LiveProvider
        code={code}
        scope={scope}
        transformCode={transformCode}
        theme={merge(theme, {
          plain: {
            fontFamily: 'Inconsolata',
            fontSize: 18,
            lineHeight: '1.5em',
          },
        })}
      >
        <div sx={styles.previewWrapper}>
          <LivePreviewWrapper showingCode={showingCode}>
            <LivePreview sx={styles.preview} />
          </LivePreviewWrapper>
          <div sx={styles.buttons}>
            <button sx={styles.button} onClick={() => copy(code)}>
              <Icons.Clipboard size={12} />
            </button>
            <button sx={styles.button} onClick={toggleCode}>
              <Icons.Code size={12} />
            </button>
          </div>
        </div>
        {showLiveError && <LiveError sx={styles.error} />}
        {showingCode && (
          <div sx={styles.editor(theme)}>
            <LiveEditor />
          </div>
        )}
      </LiveProvider>
    </Resizable>
  );
};
