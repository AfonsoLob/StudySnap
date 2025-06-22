import { createPortal } from 'react-dom';

const NotificationPortal = ({ children }) => {
  return createPortal(
    children,
    document.body
  );
};

export default NotificationPortal;
