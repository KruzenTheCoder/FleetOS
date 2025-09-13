'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-2xl',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Prevent background scrolling when modal is open
    if (open) document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div className={`modal-content w-full mx-4 sm:mx-0 ${maxWidth} p-4 sm:p-6`}>
        {children}
      </div>
    </div>,
    document.body
  );
}
