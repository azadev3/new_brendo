import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
}

const PortalComponentTwo: React.FC<Props> = ({ children }) => {
  const el = document.getElementById('tophead');
  if (!el) return null;

  return createPortal(children, el);
};

export default PortalComponentTwo;
