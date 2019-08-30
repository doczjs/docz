/** @jsx jsx */
import { jsx } from 'theme-ui';

const styles = {
  iframe: (showingCode, height = 'auto') => ({
    height,
    display: 'block',
    minHeight: '100%',
    width: 'calc(100% - 2px)',
    border: t => `1px solid ${t.colors.playground.border}`,
    borderRadius: showingCode ? '4px 4px 0 0' : '4px',
  }),
};

export const LivePreviewWrapper = ({ children, showingCode }) => {
  return <div sx={styles.iframe(showingCode)}>{children}</div>;
};
