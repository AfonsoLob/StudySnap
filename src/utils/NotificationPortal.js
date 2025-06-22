import React from 'react';
import { createPortal } from 'react-dom';

export const NotificationPortal = ({ children }) => {
  return createPortal(
    children,
    document.body
  );
};

export default NotificationPortal;
