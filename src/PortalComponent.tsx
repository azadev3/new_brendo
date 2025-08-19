import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
}

const PortalComponent: React.FC<Props> = ({ children }) => {
  const el = document.getElementById('scroll-to-top-element');
  if (!el) return null;

  return createPortal(children, el);
};

export default PortalComponent;
