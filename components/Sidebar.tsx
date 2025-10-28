import React, { useState, useContext } from 'react';
import { Page } from '../types';
import { HomeIcon, DocumentReportIcon, ArchiveIcon, ChartBarIcon } from './icons/Icons';
import { AppContext } from '../contexts/AppContext';
import PasswordModal from './PasswordModal';


interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const { isInventoryUnlocked, setIsInventoryUnlocked } = useContext(AppContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fix: Use React.ReactElement instead of JSX.Element to resolve namespace issue.
  const navItems: { page: Page; label: string; icon: React.ReactElement }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { page: 'reports', label: 'Laudos', icon: <DocumentReportIcon /> },
    { page: 'inventory', label: 'Estoque', icon: <ArchiveIcon /> },
    { page: 'indicators', label: 'Indicadores', icon: <ChartBarIcon /> },
  ];

  const handlePasswordConfirm = (password: string) => {
    if (password === '159753') {
      setIsInventoryUnlocked(true);
      setPage('inventory');
      setIsPasswordModalOpen(false);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleNavClick = (page: Page) => {
    if (page === 'inventory' && !isInventoryUnlocked) {
      setIsPasswordModalOpen(true);
    } else {
      setPage(page);
    }
  };


  return (
    <>
      <aside className="w-16 sm:w-64 bg-black bg-opacity-20 backdrop-blur-lg border-r border-gray-700/50 flex flex-col transition-all duration-300">
        <div className="flex items-center justify-center sm:justify-start h-20 border-b border-gray-700/50 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <h1 className="hidden sm:block text-lg font-bold ml-3 text-white">UBS SANTO AFONSO</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.page} className="px-4 mb-2">
                <button
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.page
                      ? 'bg-brand-secondary text-white shadow-lg'
                      : 'text-gray-300 hover:bg-brand-primary hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:block ml-4 font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handlePasswordConfirm}
        title="Acesso Restrito"
        message="Por favor, insira a senha para acessar o estoque."
      />
    </>
  );
};

export default Sidebar;