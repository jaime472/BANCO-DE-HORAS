
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PatientReport, TestType } from '../types';
import ReportFormModal from './ReportFormModal';
import ConfirmationModal from './ConfirmationModal';
import ReportPDF from './ReportPDF';
import { PlusIcon, PencilIcon, TrashIcon, DownloadIcon } from './icons/Icons';

const Reports: React.FC = () => {
  const { reports, deleteReport } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<PatientReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<PatientReport | null>(null);
  const [reportToGeneratePDF, setReportToGeneratePDF] = useState<PatientReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const openCreateModal = () => {
    setReportToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (report: PatientReport) => {
    setReportToEdit(report);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (reportToDelete) {
      try {
        await deleteReport(reportToDelete.id);
      } catch (error) {
        console.error("Failed to delete report:", error);
        alert("Falha ao excluir o laudo.");
      } finally {
        setReportToDelete(null);
      }
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report =>
      report.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.test_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white tracking-wider">Laudos</h1>
        <button onClick={openCreateModal} className="bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-200 transform hover:scale-105 shadow-lg">
          <PlusIcon /> <span className="ml-2">Novo Laudo</span>
        </button>
      </header>

      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-3d border border-gray-700/50">
        <input
          type="text"
          placeholder="Buscar por paciente ou tipo de teste..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"
        />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-3d border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-4">Paciente</th>
                <th className="p-4">Tipo de Teste</th>
                <th className="p-4">Data do Laudo</th>
                <th className="p-4">Técnico</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">{report.patient_name}</td>
                  <td className="p-4">{report.test_type}</td>
                  <td className="p-4">{new Date(report.report_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                  <td className="p-4">{report.technician_name}</td>
                  <td className="p-4 flex justify-center items-center space-x-2">
                    <button onClick={() => setReportToGeneratePDF(report)} className="p-2 rounded-full hover:bg-brand-light/50 transition-colors" title="Gerar PDF">
                      <DownloadIcon />
                    </button>
                    <button onClick={() => openEditModal(report)} className="p-2 rounded-full hover:bg-brand-secondary transition-colors" title="Editar Laudo">
                      <PencilIcon />
                    </button>
                    <button onClick={() => setReportToDelete(report)} className="p-2 rounded-full hover:bg-danger transition-colors" title="Excluir Laudo">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReports.length === 0 && <p className="text-center p-8 text-gray-400">Nenhum laudo encontrado.</p>}
        </div>
      </div>

      {isModalOpen && (
        <ReportFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reportToEdit={reportToEdit}
        />
      )}

      {reportToDelete && (
         <ConfirmationModal
          isOpen={!!reportToDelete}
          onClose={() => setReportToDelete(null)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o laudo do paciente ${reportToDelete.patient_name}? Esta ação não pode ser desfeita.`}
        />
      )}

      {reportToGeneratePDF && (
        <ReportPDF 
          report={reportToGeneratePDF} 
          onDone={() => setReportToGeneratePDF(null)} 
        />
      )}
    </div>
  );
};

export default Reports;