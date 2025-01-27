import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full transform transition-all duration-300"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Cerrar modal"
        >
          <MdClose size={24} />
        </button>
        <div id="modal-title" className="sr-only">
          Título del modal
        </div>
        <div id="modal-description" className="sr-only">
          Descripción del modal
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
