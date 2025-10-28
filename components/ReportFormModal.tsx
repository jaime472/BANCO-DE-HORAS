
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PatientReport, TestType, DengueResult, CovidResult, HcgReport, DengueReport, CovidReport, ReportFormData, BaseReport } from '../types';

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportToEdit: PatientReport | null;
}

type UnifiedFormData = Omit<BaseReport, 'id' | 'created_at'> & {
  symptom_start_date?: string;
  city?: string;
  manufacturer?: string;
  prontuario?: string;
  result_value?: string;
  result?: DengueResult | CovidResult;
  sample_type?: 'punção digital' | 'swab nasofaríngeo' | 'swab nasal' | 'urina';
  method?: 'IMUNOCROMATOGRAFIA' | 'Imunocromatografia';
};

const ReportFormModal: React.FC<ReportFormModalProps> = ({ isOpen, onClose, reportToEdit }) => {
  const { addReport, updateReport, stock } = useContext(AppContext);
  
  const getInitialFormData = useCallback((): UnifiedFormData => {
    const today = new Date().toISOString().split('T')[0];
    if (reportToEdit) {
      return { ...reportToEdit } as UnifiedFormData;
    }
    return {
      test_type: TestType.DENGUE,
      patient_name: '',
      patient_id: '',
      birth_date: '',
      sex: 'Feminino',
      execution_unit: '',
      sample_collection_date: today,
      technician_name: '',
      report_date: today,
      lote: '',
      validade: '',
      symptom_start_date: today,
      sample_type: 'punção digital',
      method: 'IMUNOCROMATOGRAFIA',
      result: DengueResult.NEGATIVE,
      city: '',
      manufacturer: '',
      prontuario: '',
      result_value: '',
    };
  }, [reportToEdit]);


  const [formData, setFormData] = useState<UnifiedFormData>(getInitialFormData());
  
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [reportToEdit, isOpen, getInitialFormData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = e.target.type === 'text' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleTestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTestType = e.target.value as TestType;
    const today = new Date().toISOString().split('T')[0];
    
    const baseData = {
        ...getInitialFormData(),
        patient_name: formData.patient_name,
        patient_id: formData.patient_id,
        birth_date: formData.birth_date,
        sex: formData.sex,
        execution_unit: formData.execution_unit,
        technician_name: formData.technician_name,
        test_type: newTestType,
    };

    switch(newTestType) {
        case TestType.DENGUE:
            setFormData({
                ...baseData,
                symptom_start_date: today,
                sample_type: 'punção digital',
                method: 'IMUNOCROMATOGRAFIA',
                result: DengueResult.NEGATIVE,
            });
            break;
        case TestType.COVID:
            setFormData({
                ...baseData,
                city: '',
                manufacturer: '',
                method: 'Imunocromatografia',
                sample_type: 'swab nasal',
                result: CovidResult.NEGATIVE,
            });
            break;
        case TestType.HCG:
             setFormData({
                ...baseData,
                prontuario: '',
                sample_type: 'urina',
                method: 'Imunocromatografia',
                result_value: '',
            });
            break;
    }
  };
  
  // FIX: Refactored handleSubmit to correctly construct a typed report object.
  // This resolves a TypeScript error by creating a clean data object based on the
  // selected test type, ensuring it matches one of the types in the PatientReport union.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportToEdit && (!formData.lote || !formData.validade)) {
      alert("Por favor, selecione um lote do estoque antes de criar o laudo.");
      return;
    }

    const commonData = {
      patient_name: formData.patient_name,
      patient_id: formData.patient_id,
      birth_date: formData.birth_date,
      sex: formData.sex,
      execution_unit: formData.execution_unit,
      sample_collection_date: formData.sample_collection_date,
      technician_name: formData.technician_name,
      report_date: formData.report_date,
      lote: formData.lote || '',
      validade: formData.validade || '',
    };

    let finalReportData: ReportFormData;

    switch (formData.test_type) {
      case TestType.DENGUE:
        finalReportData = {
          ...commonData,
          test_type: TestType.DENGUE,
          symptom_start_date: formData.symptom_start_date || '',
          sample_type: 'punção digital',
          method: 'IMUNOCROMATOGRAFIA',
          result: formData.result as DengueResult,
        };
        break;
      case TestType.COVID:
        finalReportData = {
          ...commonData,
          test_type: TestType.COVID,
          city: formData.city || '',
          manufacturer: formData.manufacturer || '',
          method: 'Imunocromatografia',
          sample_type: formData.sample_type as 'swab nasofaríngeo' | 'swab nasal',
          result: formData.result as CovidResult,
        };
        break;
      case TestType.HCG:
        finalReportData = {
          ...commonData,
          test_type: TestType.HCG,
          prontuario: formData.prontuario || '',
          sample_type: 'urina',
          method: 'Imunocromatografia',
          result_value: formData.result_value || '',
        };
        break;
      default:
        alert("Tipo de teste inválido selecionado.");
        return;
    }

    try {
      if (reportToEdit) {
        const reportForUpdate: PatientReport = {
          id: reportToEdit.id,
          created_at: reportToEdit.created_at,
          ...finalReportData,
        };
        await updateReport(reportToEdit.id, reportForUpdate);
      } else {
        await addReport(finalReportData);
      }
      onClose();
    } catch (error) {
        console.error("Failed to save report:", error);
        alert(`Falha ao salvar o laudo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  if (!isOpen) return null;

  const renderTestSpecificFields = () => {
    switch (formData.test_type) {
      case TestType.DENGUE:
        const dengueData = formData as Partial<DengueReport>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300">Data de Início dos Sintomas</label>
              <input type="date" name="symptom_start_date" value={dengueData.symptom_start_date || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Resultado</label>
              <select name="result" value={dengueData.result} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary">
                {Object.values(DengueResult).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </>
        );
      case TestType.COVID:
        const covidData = formData as Partial<CovidReport>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300">Cidade</label>
              <input type="text" name="city" value={covidData.city || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Amostra</label>
              <select name="sample_type" value={covidData.sample_type} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary">
                <option value="swab nasofaríngeo">Swab Nasofaríngeo</option>
                <option value="swab nasal">Swab Nasal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fabricante</label>
              <input type="text" name="manufacturer" value={covidData.manufacturer || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Resultado</label>
              <select name="result" value={covidData.result} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary">
                {Object.values(CovidResult).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </>
        );
      case TestType.HCG:
        const hcgData = formData as Partial<HcgReport>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300">Prontuário</label>
              <input type="text" name="prontuario" value={hcgData.prontuario || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Valor de Referência</label>
              <input type="text" name="result_value" value={hcgData.result_value || ''} placeholder="ex: <25mUI/mL" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-gray-800 rounded-2xl shadow-3d w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700/50">
        <form onSubmit={handleSubmit} className="p-5">
            <h2 className="text-2xl font-bold text-white mb-4">{reportToEdit ? 'Editar Laudo' : 'Novo Laudo'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Tipo de Teste</label>
                <select name="test_type" value={formData.test_type} onChange={handleTestTypeChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary">
                  {Object.values(TestType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {/* Patient Info Section */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-lg font-semibold text-brand-accent border-b border-gray-600 pb-2">Informações do Paciente</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">Nome do Paciente/Usuário</label>
                <input type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Identidade/CPF</label>
                <input type="text" name="patient_id" value={formData.patient_id || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Data de Nascimento</label>
                <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Sexo</label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary">
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
             
              {/* Test Info Section */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-lg font-semibold text-brand-accent border-b border-gray-600 pb-2">Informações do Teste</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Unidade de Realização</label>
                <input type="text" name="execution_unit" value={formData.execution_unit} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Data da Coleta da Amostra</label>
                <input type="date" name="sample_collection_date" value={formData.sample_collection_date} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">Lote e Validade</label>
                   <select 
                      name="lote_validade" 
                      onChange={(e) => {
                          const [lote, validade] = e.target.value.split('|');
                          setFormData(prev => ({ ...prev, lote, validade }));
                      }}
                      value={`${formData.lote || ''}|${formData.validade || ''}`}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                      required={!reportToEdit}
                   >
                      <option value="|">Selecione um lote do estoque</option>
                      {stock.filter(s => s.test_type === formData.test_type && s.quantity > 0).map(s => (
                          <option key={s.id} value={`${s.lote}|${s.validade}`}>
                              Lote: {s.lote} / Val: {new Date(s.validade).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} ({s.quantity} und.)
                          </option>
                      ))}
                   </select>
              </div>
              {renderTestSpecificFields()}

              {/* Responsible Info Section */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-lg font-semibold text-brand-accent border-b border-gray-600 pb-2">Informações do Responsável</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Técnico Executor</label>
                <input type="text" name="technician_name" value={formData.technician_name} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Data do Laudo</label>
                <input type="date" name="report_date" value={formData.report_date} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"/>
              </div>

            </div> {/* End grid */}
            
            <div className="flex justify-end space-x-4 pt-4 mt-3 border-t border-gray-700/50">
                <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition">Cancelar</button>
                <button type="submit" className="py-2 px-4 bg-brand-secondary hover:bg-opacity-80 text-white font-bold rounded-lg transition">{reportToEdit ? 'Salvar Alterações' : 'Criar Laudo'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFormModal;
