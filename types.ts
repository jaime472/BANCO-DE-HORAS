export enum TestType {
  DENGUE = 'Teste de Antígeno para Dengue - NS1',
  COVID = 'Teste Rápido de Antígeno - COVID-19',
  HCG = 'Teste Rápido para Detecção de HCG',
}

export enum DengueResult {
  POSITIVE = 'Positivo',
  NEGATIVE = 'Negativo',
  INCONCLUSIVE = 'Inconclusivo',
}

export enum CovidResult {
  POSITIVE = 'Positivo',
  NEGATIVE = 'Negativo',
}

export interface StockItem {
  id: number;
  test_type: TestType;
  lote: string;
  validade: string;
  quantity: number;
}

export interface BaseReport {
  id: number;
  patient_name: string;
  patient_id?: string;
  birth_date: string;
  sex: 'Masculino' | 'Feminino';
  execution_unit: string;
  sample_collection_date: string;
  technician_name: string;
  report_date: string;
  test_type: TestType;
  lote: string;
  validade: string;
  created_at: string;
}

export interface IndicatorRecord {
  id: number;
  date: string;
  gmus: string;
  pressure?: string;
  hgt?: string;
  weight?: string;
  height?: string;
  professional: string;
}

export interface DengueReport extends BaseReport {
  test_type: TestType.DENGUE;
  symptom_start_date: string;
  sample_type: 'punção digital';
  method: 'IMUNOCROMATOGRAFIA';
  result: DengueResult;
}

export interface CovidReport extends BaseReport {
  test_type: TestType.COVID;
  city: string;
  manufacturer: string;
  method: 'Imunocromatografia';
  sample_type: 'swab nasofaríngeo' | 'swab nasal';
  result: CovidResult;
}

export interface HcgReport extends BaseReport {
  test_type: TestType.HCG;
  prontuario: string;
  sample_type: 'urina';
  method: 'Imunocromatografia';
  result_value: string;
}

export type PatientReport = DengueReport | CovidReport | HcgReport;

export type Page = 'dashboard' | 'reports' | 'inventory' | 'indicators';

export type ReportFormData = Omit<PatientReport, 'id' | 'created_at'>;