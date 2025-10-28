import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  message: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-gray-800 rounded-2xl shadow-3d w-full max-w-md border border-gray-700/50">
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-300">{message}</p>
          <div>
            <label htmlFor="password-input" className="sr-only">Senha</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="Digite a senha"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" className="py-2 px-4 bg-brand-secondary hover:bg-opacity-80 text-white font-bold rounded-lg transition">
              Acessar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
