/** @jsx jsx */
import { jsx } from 'theme-ui';
import { createRef, SyntheticEvent } from 'react';

import { useScrollLock, useEscape } from '../../utils/hooks';
import { Portal } from '../Portal';
import * as Icons from '../Icons';

import * as styles from './styles';

interface DialogProps {
  title: string;
  onClose: () => any;
  width?: string;
  height?: string;
}

export const Dialog: React.FC<DialogProps> = props => {
  const { children, onClose, title, height = '90%', width = '90%' } = props;

  const dialogContentRef = createRef<HTMLDivElement>();

  useScrollLock();

  useEscape(onClose);

  const handleClick = (event: SyntheticEvent) => {
    const node = event.target as Node;
    if (dialogContentRef.current && dialogContentRef.current.contains(node)) {
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
          sx={styles.content(width, height)}
          aria-modal={true}
          ref={dialogContentRef}
          onMouseDown={handleClick}
        >
          <span sx={styles.close} onClick={onClose}>
            <Icons.Close size={20} />
          </span>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Dialog;
