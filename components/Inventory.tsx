
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { StockItem } from '../types';
import StockFormModal from './StockFormModal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/Icons';

const Inventory: React.FC = () => {
  const { stock, deleteStockItem } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<StockItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null);

  const openCreateModal = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: StockItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteStockItem(itemToDelete.id);
      } catch (error) {
        console.error("Failed to delete stock item:", error);
        alert("Falha ao excluir o item de estoque.");
      } finally {
        setItemToDelete(null);
      }
    }
  };

  const sortedStock = useMemo(() => {
    return [...stock].sort((a, b) => a.test_type.localeCompare(b.test_type));
  }, [stock]);

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white tracking-wider">Estoque</h1>
        <button onClick={openCreateModal} className="bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-200 transform hover:scale-105 shadow-lg">
          <PlusIcon /> <span className="ml-2">Adicionar Item</span>
        </button>
      </header>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-3d border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4">Tipo de Teste</th>
                <th className="p-4">Lote</th>
                <th className="p-4">Validade</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedStock.map(item => (
                <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">{item.test_type}</td>
                  <td className="p-4">{item.lote}</td>
                  <td className="p-4">{new Date(item.validade).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                  <td className={`p-4 font-bold ${item.quantity <= 5 ? 'text-danger' : ''}`}>{item.quantity}</td>
                  <td className="p-4 flex justify-center items-center space-x-2">
                    <button onClick={() => openEditModal(item)} className="p-2 rounded-full hover:bg-brand-secondary transition-colors">
                      <PencilIcon />
                    </button>
                    <button onClick={() => setItemToDelete(item)} className="p-2 rounded-full hover:bg-danger transition-colors">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {sortedStock.length === 0 && <p className="text-center p-8 text-gray-400">Nenhum item em estoque.</p>}
        </div>
      </div>

      {isModalOpen && (
        <StockFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemToEdit={itemToEdit}
        />
      )}

      {itemToDelete && (
         <ConfirmationModal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o item de estoque "${itemToDelete.test_type}" (Lote: ${itemToDelete.lote})?`}
        />
      )}
    </div>
  );
};

export default Inventory;