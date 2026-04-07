import React from 'react';

/**
 * Modal component
 * Standard modal for the application.
 */
function Modal({ icon, title, msg, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">{icon}</div>
        <div className="modal-title">{title}</div>
        <div className="modal-msg">{msg}</div>
        <div className="modal-actions">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
