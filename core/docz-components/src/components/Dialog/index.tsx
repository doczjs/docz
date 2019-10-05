/** @jsx jsx */
import { jsx } from 'theme-ui';
import { createRef, SyntheticEvent } from 'react';

import { useScrollLock, useEscape } from '../../utils/hooks';
import { Portal } from '../Portal';

import * as styles from './styles';

interface DialogProps {
  title: string;
  onClose: () => any;
}

export const Dialog: React.FC<DialogProps> = props => {
  const { children, onClose, title } = props;

  const dialogContentRef = createRef<HTMLDivElement>();

  useScrollLock();

  useEscape(onClose);

  const handleClick = (event: SyntheticEvent) => {
    const node = event.target as Node;
    if (
      dialogContentRef.current &&
      dialogContentRef.current.contains(node)
    ) {
      return;
    }
    onClose();
  };

  return (
    <Portal>
      <div sx={styles.overlay} onMouseDown={handleClick}>
        <div
          aria-label={title}
          role="dialog"
          sx={styles.content}
          aria-modal={true}
          ref={dialogContentRef}
          onMouseDown={handleClick}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Dialog;
