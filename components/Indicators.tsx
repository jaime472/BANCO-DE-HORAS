
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { IndicatorRecord } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { PencilIcon, TrashIcon, DownloadIcon } from './icons/Icons';

const Indicators: React.FC = () => {
  const { indicators, addIndicator, updateIndicator, deleteIndicator } = useContext(AppContext);

  const getInitialFormData = (): Omit<IndicatorRecord, 'id'> => ({
    date: new Date().toISOString().split('T')[0],
    gmus: '',
    pressure: '',
    hgt: '',
    weight: '',
    height: '',
    professional: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [recordToEdit, setRecordToEdit] = useState<IndicatorRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<IndicatorRecord | null>(null);

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date,
        gmus: recordToEdit.gmus,
        pressure: recordToEdit.pressure || '',
        hgt: recordToEdit.hgt || '',
        weight: recordToEdit.weight || '',
        height: recordToEdit.height || '',
        professional: recordToEdit.professional,
      });
    } else {
      setFormData(getInitialFormData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Converte o valor para maiúsculas se for um campo de texto.
    const finalValue = e.target.type === 'text' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gmus || !formData.professional) {
        alert("Os campos G'mus e Profissional são obrigatórios.");
        return;
    }
    
    try {
        if (recordToEdit) {
          await updateIndicator(recordToEdit.id, formData);
          setRecordToEdit(null);
        } else {
          await addIndicator(formData);
        }
        setFormData(getInitialFormData());
    } catch (error) {
        console.error("Failed to save indicator:", error);
        alert("Falha ao salvar o registro do indicador.");
    }
  };
  
  const handleEdit = (record: IndicatorRecord) => {
    setRecordToEdit(record);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setRecordToEdit(null);
    setFormData(getInitialFormData());
  };

  const handleDelete = async () => {
    if (recordToDelete) {
      try {
        await deleteIndicator(recordToDelete.id);
      } catch (error) {
        console.error("Failed to delete indicator:", error);
        alert("Falha ao excluir o registro do indicador.");
      } finally {
        setRecordToDelete(null);
      }
    }
  };
  
  const handleExportCSV = () => {
    const headers = ['Data', 'G\'mus', 'Pressão', 'HGT', 'Peso (Kg)', 'Estatura (Cm)', 'Profissional'];
    const rows = sortedIndicators.map(rec => 
        [
            new Date(rec.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}),
            `"${rec.gmus}"`,
            `"${rec.pressure || ''}"`,
            `"${rec.hgt || ''}"`,
            `"${rec.weight || ''}"`,
            `"${rec.height || ''}"`,
            `"${rec.professional}"`
        ].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "indicadores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedIndicators = useMemo(() => {
    return [...indicators].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [indicators]);

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-white tracking-wider">Indicadores</h1>
      </header>

      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-3d border border-gray-700/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{recordToEdit ? 'Editando Registro' : 'Novo Registro de Indicador'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Data do Dia</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">G'mus <span className="text-danger">*</span></label>
              <input type="text" name="gmus" value={formData.gmus} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Pressão</label>
              <input type="text" name="pressure" value={formData.pressure} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">HGT</label>
              <input type="text" name="hgt" value={formData.hgt} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Peso (Kg)</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Estatura (Cm)</label>
              <input type="text" name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
             <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Profissional <span className="text-danger">*</span></label>
              <input type="text" name="professional" value={formData.professional} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            {recordToEdit && (
                <button type="button" onClick={handleCancelEdit} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition">Cancelar Edição</button>
            )}
            <button type="submit" className="py-2 px-4 bg-brand-secondary hover:bg-opacity-80 text-white font-bold rounded-lg transition">{recordToEdit ? 'Salvar Alterações' : 'Salvar Registro'}</button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-3d border border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Relatórios</h2>
            <button onClick={handleExportCSV} className="bg-brand-accent hover:bg-opacity-80 text-black font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-200 transform hover:scale-105 shadow-lg">
                <DownloadIcon /> <span className="ml-2">Exportar para CSV</span>
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">G'mus</th>
                <th className="p-4">Pressão</th>
                <th className="p-4">HGT</th>
                <th className="p-4">Peso</th>
                <th className="p-4">Estatura</th>
                <th className="p-4">Profissional</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedIndicators.map(rec => (
                <tr key={rec.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">{new Date(rec.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                  <td className="p-4">{rec.gmus}</td>
                  <td className="p-4">{rec.pressure}</td>
                  <td className="p-4">{rec.hgt}</td>
                  <td className="p-4">{rec.weight}</td>
                  <td className="p-4">{rec.height}</td>
                  <td className="p-4">{rec.professional}</td>
                  <td className="p-4 flex justify-center items-center space-x-2">
                    <button onClick={() => handleEdit(rec)} className="p-2 rounded-full hover:bg-brand-secondary transition-colors" title="Editar">
                      <PencilIcon />
                    </button>
                    <button onClick={() => setRecordToDelete(rec)} className="p-2 rounded-full hover:bg-danger transition-colors" title="Excluir">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedIndicators.length === 0 && <p className="text-center p-8 text-gray-400">Nenhum registro de indicador encontrado.</p>}
        </div>
      </div>
      
      {recordToDelete && (
         <ConfirmationModal
          isOpen={!!recordToDelete}
          onClose={() => setRecordToDelete(null)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o registro do dia ${new Date(recordToDelete.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}?`}
        />
      )}
    </div>
  );
};

export default Indicators;