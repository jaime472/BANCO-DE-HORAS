
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { StockItem, TestType } from '../types';

interface StockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit: StockItem | null;
}

const StockFormModal: React.FC<StockFormModalProps> = ({ isOpen, onClose, itemToEdit }) => {
  const { addStockItem, updateStockItem } = useContext(AppContext);
  const [formData, setFormData] = useState<Omit<StockItem, 'id'>>({
    test_type: TestType.DENGUE,
    lote: '',
    validade: '',
    quantity: 0,
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        test_type: itemToEdit.test_type,
        lote: itemToEdit.lote,
        validade: itemToEdit.validade,
        quantity: itemToEdit.quantity,
      });
    } else {
      setFormData({
        test_type: TestType.DENGUE,
        lote: '',
        validade: '',
        quantity: 0,
      });
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;

    if (name === 'quantity') {
      finalValue = parseInt(value, 10) || 0;
    } else if (e.target.type === 'text') {
      finalValue = value.toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (itemToEdit) {
        await updateStockItem(itemToEdit.id, formData);
      } else {
        await addStockItem(formData);
      }
      onClose();
    } catch(error) {
      console.error("Failed to save stock item:", error);
      alert("Falha ao salvar o item de estoque.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-3d w-full max-w-md border border-gray-700/50">
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <h2 className="text-2xl font-bold text-white pb-2">{itemToEdit ? 'Editar Item do Estoque' : 'Adicionar ao Estoque'}</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Tipo de Teste</label>
            <select name="test_type" value={formData.test_type} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary">
              {Object.values(TestType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Lote</label>
            <input type="text" name="lote" value={formData.lote} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Validade</label>
            <input type="date" name="validade" value={formData.validade} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Quantidade</label>
            <input type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
          </div>

          <div className="flex justify-end space-x-4 pt-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-brand-secondary hover:bg-opacity-80 text-white font-bold rounded-lg transition">{itemToEdit ? 'Salvar Alterações' : 'Adicionar Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockFormModal;