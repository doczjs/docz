/** @jsx jsx */
import { jsx } from 'theme-ui';
import { SFC, FC } from 'react';
import * as Icons from '../Icons';
import * as styles from './styles';

export interface DialogActionsProps {
  onChangeSize: (width: string, height: string) => void;
}

export const DialogActions: SFC<DialogActionsProps> = ({ onChangeSize }) => (
  <div>
    <div sx={styles.buttons}>
      <ActionButton
        onClick={() => onChangeSize('360px', '640px')}
        title="Smartphone"
      >
        <Icons.Smartphone width={20} />
      </ActionButton>
      <ActionButton
        onClick={() => onChangeSize('768px', '1024px')}
        title="Tablet"
      >
        <Icons.Tablet width={20} />
      </ActionButton>
      <ActionButton
        onClick={() => onChangeSize('1366px', '1024px')}
        title="Monitor"
      >
        <Icons.Monitor width={20} />
      </ActionButton>
    </div>
  </div>
);

export interface ActionButtonProps {
  onClick: () => void;
  title: string;
}

const ActionButton: FC<ActionButtonProps> = ({ onClick, title, children }) => {
  return (
    <button sx={styles.actionButton} onClick={onClick} title={title}>
      {children}
    </button>
  );
};
