/** @jsx jsx */
import { createPortal } from "react-dom";

interface PortalProps {
  key?: string | undefined | null;
  root?: string;
}

/**
 * Helper component to mount the tooltip outside of the hovered element
 * with the use of 'createPortal'. The tooltip will be rendered at the top node
 * instead of inside the element with the tooltip
 */
export const Portal: React.FC<PortalProps> = ({
  children,
  key,
  root = "___gatsby"
}) => {
  const rootElement = document.getElementById(root);
  if (!rootElement) return null;
  return createPortal(children, rootElement, key);
};
