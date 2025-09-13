'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ open, onClose, children, maxWidth = 'max-w-2xl' }:{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;
  return createPortal(
    <div className="modal-overlay active" onClick={(e)=>{ if (e.currentTarget === e.target) onClose(); }}>
      <div className={`modal-content w-full ${maxWidth} p-4 sm:p-6`}>
        {children}
      </div>
    </div>,
    document.body
  );
}