import * as React from 'react'
import { SFC } from 'react'
import * as Icons from '../Icons'

const wrapper = {
  position: 'absolute',
  top: 2,
  left: '50%',
  marginBottom: 1,
  transform: 'translateX(-50%)' 
}

const buttons = {
  display: 'flex',
  background: '',
  border: '1px solid white',
  borderRadius: 2,
  padding: '3px 5px'
}

export interface ResizeProps {
  onChangeSize: (width: string, height: string) => void
}

export const DialogActions: SFC<ResizeProps> = ({ onChangeSize }) => (
  <div sx={wrapper}>
    <div sx={buttons}>
      <button
        onClick={() => onChangeSize('360px', '640px')}
        title="Smartphone"
      >
        <Icons.Smartphone width={20} />
      </button>
      <button
        onClick={() => onChangeSize('768px', '1024px')}
        title="Tablet"
      >
        <Icons.Tablet width={20} />
      </button>
      <button
        onClick={() => onChangeSize('1366px', '1024px')}
        title="Monitor"
      >
        <Icons.Monitor width={20} />
      </button>
    </div>
  </div>
)