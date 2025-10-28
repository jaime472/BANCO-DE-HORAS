
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-gray-800 rounded-2xl shadow-3d w-full max-w-md border border-gray-700/50">
        <div className="p-5 space-y-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-300">{message}</p>
          <div className="flex justify-end space-x-4 pt-4">
            <button onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition">
              Cancelar
            </button>
            <button onClick={onConfirm} className="py-2 px-4 bg-danger hover:bg-opacity-80 text-white font-bold rounded-lg transition">
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;