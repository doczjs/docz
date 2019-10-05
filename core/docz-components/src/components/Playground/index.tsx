/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useState } from 'react';
import {
  LiveProvider,
  LiveError,
  LivePreview,
  LiveEditor,
  LiveProviderProps,
} from 'react-live';
import { Resizable } from 're-resizable';
import copy from 'copy-text-to-clipboard';

import { usePrismTheme } from '../../utils/theme';
import { LivePreviewWrapper } from './LivePreviewWrapper';
import * as styles from './styles';
import * as Icons from '../Icons';
import { Dialog } from '../Dialog'

export type PlaygroundProps = {
  code: string;
  scope:
    | {
        [key: string]: any;
      }
    | undefined;
  showPlaygroundEditor?: boolean;
  showLiveError?: boolean;
  showLivePreview?: boolean;
  language?: LiveProviderProps['language'];
  className?: string;
  style?: any;
  wrapper?: any;

  position?: any;
};

export const Playground = ({
  code,
  scope,
  showPlaygroundEditor = true,
  showLiveError,
  showLivePreview = true,
  language,
}: PlaygroundProps) => {
  const theme = usePrismTheme();
  const [showingCode, setShowingCode] = useState(() => showPlaygroundEditor);
  const [width, setWidth] = useState(() => '100%');
  const [showFullscreen, setShowFullscreen] = useState<boolean>(() => false)

  const transformCode = (codeToTransform: string) => {
    if (codeToTransform.startsWith('()') || codeToTransform.startsWith('class'))
      return codeToTransform;
    return `<React.Fragment>${codeToTransform}</React.Fragment>`;
  }

  const toggleCode = () => {
    setShowingCode(s => !s);
  }

  const toggleFullscreen = () => {
    setShowFullscreen((f) => !f)
  }

  const resizableProps = {
    minWidth: 260,
    maxWidth: '100%',
    size: {
      width,
      height: 'auto',
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
    onResizeStop: (e: any, direction: any, ref: any) => {
      setWidth(ref.style.width);
    },
  };
  
  return (
    <Resizable {...resizableProps} data-testid="playground">
      <LiveProvider
        code={code}
        scope={scope}
        transformCode={transformCode}
        language={language}
        theme={theme}
      >
        <div sx={styles.previewWrapper}>
          <LivePreviewWrapper showingCode={showingCode}>
            {showLivePreview && (
              <LivePreview sx={styles.preview} data-testid="live-preview" />
            )}
          </LivePreviewWrapper>
          <div sx={styles.buttons}>
            <button sx={styles.button} onClick={() => copy(code)}>
              <Icons.Clipboard size={14} />
            </button>
            <button sx={styles.button} onClick={toggleCode}>
              <Icons.Code size={14} />
            </button>
            <button sx={styles.button} onClick={toggleFullscreen}>
              <Icons.Maximize size={14} />
            </button>
          </div>
        </div>
        {showLiveError && (
          <LiveError sx={styles.error} data-testid="live-error" />
        )}
        {showingCode && (
          <div sx={styles.editor(theme)}>
            <LiveEditor data-testid="live-editor" />
          </div>
        )}
        {showFullscreen &&
          <Dialog
            title="Live Preview"
            onClose={toggleFullscreen}
            data-testid="livepreview-fullscreen"
          >
            <div sx={styles.previewWrapper}>
              <LivePreviewWrapper showingCode={showingCode}>
                {showLivePreview && (
                  <LivePreview sx={styles.preview} data-testid="live-preview" />
                )}
              </LivePreviewWrapper>
              {showLiveError && (
                <LiveError sx={styles.error} data-testid="live-error" />
              )}
              {showingCode && (
                <div sx={styles.editor(theme)}>
                  <LiveEditor data-testid="live-editor" />
                </div>
              )}
            </div>
          </Dialog>}
      </LiveProvider>
    </Resizable>
  );
};
