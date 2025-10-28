
import React, { useEffect } from 'react';
import { PatientReport, TestType, DengueReport, CovidReport, HcgReport } from '../types';

// Declaração para jspdf e html2canvas, pois são carregados globalmente via tag de script
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface ReportPDFProps {
  report: PatientReport;
  onDone: () => void;
}

// Manter os templates existentes, pois eles renderizam o conteúdo do laudo
const renderUnderlinedField = (label: string, value: string | undefined) => (
  <div className="flex items-baseline">
    <span className="font-semibold mr-2">{label}</span>
    <span className="flex-1 border-b border-dotted border-black text-left pb-1">{value || ''}</span>
  </div>
);

const DengueTemplate: React.FC<{ report: DengueReport }> = ({ report }) => (
  <div className="p-10 font-sans text-black flex flex-col min-h-full" style={{ fontSize: '10pt' }}>
    <header className="text-center mb-6">
      <h1 className="text-2xl font-bold">UBS SANTO AFONSO</h1>
    </header>
    <section className="text-center my-8">
      <h1 className="text-lg font-bold uppercase">Teste de Antígeno para Dengue - NS1</h1>
      <h2 className="text-md">(Vida Rapid Test - Vida Biotecnologia)</h2>
    </section>
    <section className="space-y-3 mb-6 text-sm">
      {renderUnderlinedField("Nome do usuário:", report.patient_name)}
      {renderUnderlinedField("Identidade/CPF:", report.patient_id)}
      <div className="flex space-x-8">
        <div className="w-1/2">{renderUnderlinedField("Data de Nascimento:", new Date(report.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}</div>
        <div className="w-1/2">{renderUnderlinedField("Sexo:", report.sex)}</div>
      </div>
      {renderUnderlinedField("Unidade de realização do exame:", report.execution_unit)}
      {renderUnderlinedField("Data do início dos sintomas:", new Date(report.symptom_start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}
      {renderUnderlinedField("Data da coleta da amostra:", new Date(report.sample_collection_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}
    </section>
    <section className="border-2 border-black text-sm">
      <div className="p-2 border-b-2 border-black"><strong>Amostra:</strong> {report.sample_type}</div>
      <div className="p-2 border-b-2 border-black"><strong>Teste:</strong> Vida Rapid Test - Dengue NS1 (Vida Biotecnologia)</div>
      <div className="flex border-b-2 border-black">
        <div className="w-1/2 p-2 border-r-2 border-black"><strong>Lote:</strong> {report.lote}</div>
        <div className="w-1/2 p-2"><strong>Validade:</strong> {new Date(report.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
      </div>
      <div className="p-2"><strong>Método:</strong> {report.method}</div>
    </section>
    <section className="border border-black mt-6 p-2" style={{ backgroundColor: '#f0f0f0' }}>
      <div className="text-right font-semibold text-lg">Resultado</div>
      <div className="text-center text-3xl font-bold my-4 uppercase">{report.result}</div>
    </section>
    <section className="mt-6 space-y-3" style={{ fontSize: '8pt', lineHeight: '1.2' }}>
        <p><span className="font-bold">➔ Em caso de resultado NEGATIVO ou INCONCLUSIVO: REALIZAR NOVA COLETA A PARTIR DO 7º DIA DO INÍCIO DOS SINTOMAS, para o exame de análise de anticorpos IgM.</span> Dirigir-se ao Laboratório Público Municipal de Novo Hamburgo, localizado na Rua Pedro Adams Filho, n.º 6520, Bairro Operário, junto ao Hospital Municipal, das 7 às 18h, de segunda à sexta-feira. OBS: Essa coleta deve ser realizada, NO MÁXIMO, até o 30º dia de sintomas.</p>
        <p><span className="font-bold">Nota:</span> O resultado deste teste laboratorial deve ser sempre considerado no contexto da clínica e dos dados epidemiológicos no estabelecimento do diagnóstico. Adverte-se que os testes rápidos (punção digital) deverão ser utilizados apenas como triagem, necessitando a realização de um teste laboratorial para confirmação do caso. Os resultados mostraram que a sensibilidade relativa do Teste Rápido de Dengue NS1 da Vida Biotecnologia/Vida Rapide Test (sangue total/soro/plasma) é de 95,8% e a especificidade relativa é de 96,1%.</p>
    </section>
    <div className="flex-grow"></div>
    <footer className="mt-auto pt-12 text-sm">
      <div className="flex justify-between items-end">
        <div className="text-center">
            <div className="w-80 border-t-2 border-black mb-1"></div>
            <p className="font-semibold uppercase">{report.technician_name}</p>
            <p>Técnico Responsável</p>
        </div>
        <div>
            <p className="font-semibold">Data do Laudo: {new Date(report.report_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
        </div>
      </div>
      <p className="text-xs text-gray-700 text-center mt-6">Este laudo foi gerado eletronicamente. Confirme as informações com o profissional de saúde.</p>
       <div className="text-center mt-8 pt-4 border-t border-black" style={{ fontSize: '8pt' }}>
        <p className="font-bold">Desenvolvido por: Jaime Eduardo | Whats: 51985502897</p>
      </div>
    </footer>
  </div>
);

const CovidTemplate: React.FC<{ report: CovidReport }> = ({ report }) => (
  <div className="p-10 font-sans text-black flex flex-col min-h-full" style={{ fontSize: '10pt' }}>
    <header className="text-center mb-6">
      <h1 className="text-2xl font-bold">UBS SANTO AFONSO</h1>
    </header>
    <section className="text-center my-8"><h1 className="text-lg font-bold uppercase">Teste Rápido de Antígeno - COVID-19</h1><h2 className="text-md">({report.manufacturer || 'Fabricante não informado'})</h2></section>
    <section className="space-y-3 mb-6 text-sm">
      {renderUnderlinedField("Nome do usuário:", report.patient_name)}
      {renderUnderlinedField("Identidade/CPF:", report.patient_id)}
      <div className="flex space-x-8"><div className="w-1/2">{renderUnderlinedField("Data de Nascimento:", new Date(report.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}</div><div className="w-1/2">{renderUnderlinedField("Sexo:", report.sex)}</div></div>
      {renderUnderlinedField("Unidade de realização do exame:", report.execution_unit)}
      {renderUnderlinedField("Cidade:", report.city)}
      {renderUnderlinedField("Data da coleta da amostra:", new Date(report.sample_collection_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}
    </section>
    <section className="border-2 border-black text-sm">
      <div className="p-2 border-b-2 border-black"><strong>Amostra:</strong> {report.sample_type}</div>
      <div className="p-2 border-b-2 border-black"><strong>Teste:</strong> Teste Rápido de Antígeno para COVID-19</div>
      <div className="flex border-b-2 border-black"><div className="w-1/2 p-2 border-r-2 border-black"><strong>Lote:</strong> {report.lote}</div><div className="w-1/2 p-2"><strong>Validade:</strong> {new Date(report.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div></div>
      <div className="p-2"><strong>Método:</strong> {report.method}</div>
    </section>
    <section className="border border-black mt-6 p-2" style={{ backgroundColor: '#f0f0f0' }}><div className="text-right font-semibold text-lg">Resultado</div><div className="text-center text-3xl font-bold my-4 uppercase">{report.result}</div></section>
    <section className="mt-6 space-y-3" style={{ fontSize: '8pt', lineHeight: '1.2' }}><p><span className="font-bold">Nota:</span> Um resultado <strong>POSITIVO</strong> indica a presença de antígenos do vírus SARS-CoV-2 na amostra coletada. É fundamental seguir as orientações de isolamento e procurar acompanhamento médico.</p><p>Um resultado <strong>NEGATIVO</strong> não exclui a possibilidade de infecção, especialmente em fases iniciais dos sintomas. A coleta inadequada da amostra ou baixa carga viral podem levar a um resultado falso-negativo. Se os sintomas persistirem ou em caso de contato com caso confirmado, a avaliação médica é recomendada.</p></section>
    <div className="flex-grow"></div>
    <footer className="mt-auto pt-12 text-sm">
      <div className="flex justify-between items-end">
        <div className="text-center"><div className="w-80 border-t-2 border-black mb-1"></div><p className="font-semibold uppercase">{report.technician_name}</p><p>Técnico Responsável</p></div>
        <div><p className="font-semibold">Data do Laudo: {new Date(report.report_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p></div>
      </div>
      <p className="text-xs text-gray-700 text-center mt-6">Este laudo foi gerado eletronicamente. Confirme as informações com o profissional de saúde.</p>
       <div className="text-center mt-8 pt-4 border-t border-black" style={{ fontSize: '8pt' }}><p className="font-bold">Desenvolvido por: Jaime Eduardo | Whats: 51985502897</p></div>
    </footer>
  </div>
);

const HcgTemplate: React.FC<{ report: HcgReport }> = ({ report }) => (
  <div className="p-10 font-sans text-black flex flex-col min-h-full" style={{ fontSize: '10pt' }}>
    <header className="text-center mb-6">
      <h1 className="text-2xl font-bold">UBS SANTO AFONSO</h1>
    </header>
    <section className="text-center my-8"><h1 className="text-lg font-bold uppercase">Teste Rápido para Detecção de HCG</h1></section>
    <section className="space-y-3 mb-6 text-sm">
      {renderUnderlinedField("Nome do usuário:", report.patient_name)}
      {renderUnderlinedField("Prontuário:", report.prontuario)}
      <div className="flex space-x-8"><div className="w-1/2">{renderUnderlinedField("Data de Nascimento:", new Date(report.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}</div><div className="w-1/2">{renderUnderlinedField("Sexo:", report.sex)}</div></div>
      {renderUnderlinedField("Unidade de realização do exame:", report.execution_unit)}
      {renderUnderlinedField("Data da coleta da amostra:", new Date(report.sample_collection_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }))}
    </section>
    <section className="border-2 border-black text-sm">
      <div className="p-2 border-b-2 border-black"><strong>Amostra:</strong> {report.sample_type}</div>
      <div className="p-2 border-b-2 border-black"><strong>Teste:</strong> Teste Rápido para Detecção de HCG</div>
      <div className="flex border-b-2 border-black"><div className="w-1/2 p-2 border-r-2 border-black"><strong>Lote:</strong> {report.lote}</div><div className="w-1/2 p-2"><strong>Validade:</strong> {new Date(report.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div></div>
      <div className="p-2"><strong>Método:</strong> {report.method}</div>
    </section>
    <section className="border border-black mt-6 p-2" style={{ backgroundColor: '#f0f0f0' }}><div className="text-right font-semibold text-lg">Resultado</div><div className="text-center text-3xl font-bold my-4 uppercase">{report.result_value}</div></section>
    <section className="mt-6 space-y-3" style={{ fontSize: '8pt', lineHeight: '1.2' }}><p><span className="font-bold">Nota:</span> Este é um teste de triagem qualitativo. A interpretação do resultado deve ser realizada por um profissional de saúde, correlacionando com os dados clínicos do paciente.</p><p>Resultados <strong>POSITIVOS</strong> são sugestivos de gravidez, mas devem ser confirmados por avaliação médica. Resultados <strong>NEGATIVOS</strong> em fases muito iniciais da gestação podem não ser conclusivos. Recomenda-se repetir o teste após alguns dias caso a suspeita persista ou a menstruação atrase.</p></section>
    <div className="flex-grow"></div>
    <footer className="mt-auto pt-12 text-sm">
      <div className="flex justify-between items-end">
        <div className="text-center"><div className="w-80 border-t-2 border-black mb-1"></div><p className="font-semibold uppercase">{report.technician_name}</p><p>Técnico Responsável</p></div>
        <div><p className="font-semibold">Data do Laudo: {new Date(report.report_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p></div>
      </div>
      <p className="text-xs text-gray-700 text-center mt-6">Este laudo foi gerado eletronicamente. Confirme as informações com o profissional de saúde.</p>
       <div className="text-center mt-8 pt-4 border-t border-black" style={{ fontSize: '8pt' }}><p className="font-bold">Desenvolvido por: Jaime Eduardo | Whats: 51985502897</p></div>
    </footer>
  </div>
);

const ReportPDF: React.FC<ReportPDFProps> = ({ report, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const reportElement = document.getElementById('printable-report-for-pdf');
      
      if (!reportElement || !window.html2canvas || !window.jspdf) {
        console.error("Elemento do laudo ou bibliotecas de PDF não encontrados.");
        alert("Ocorreu um erro ao preparar a geração do PDF. Tente novamente.");
        onDone();
        return;
      }
      
      const { jsPDF } = window.jspdf;

      window.html2canvas(reportElement, {
        scale: 3, // Escala maior para melhor qualidade de imagem
        useCORS: true,
        logging: false,
      }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

        const fileName = `laudo_${report.patient_name.replace(/\s+/g, '_')}_${new Date(report.report_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}.pdf`;
        pdf.save(fileName);
        
        onDone();
      }).catch((err: Error) => {
        console.error("Erro durante a geração do PDF:", err);
        alert("Ocorreu um erro ao gerar o arquivo PDF. Verifique o console para mais detalhes.");
        onDone();
      });

    }, 500);

    return () => clearTimeout(timer);
  }, [report, onDone]);

  const renderReport = () => {
    switch (report.test_type) {
      case TestType.DENGUE:
        return <DengueTemplate report={report as DengueReport} />;
      case TestType.COVID:
        return <CovidTemplate report={report as CovidReport} />;
      case TestType.HCG:
        return <HcgTemplate report={report as HcgReport} />;
      default:
        return <div className="p-8">Tipo de laudo não suportado.</div>;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[1000] animate-fade-in">
        <div className="bg-brand-secondary text-white font-bold py-4 px-6 rounded-xl shadow-3d flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando arquivo PDF, por favor aguarde...
        </div>
      </div>
      
      <div className="absolute top-0 -left-[9999px] z-0">
        <div id="printable-report-for-pdf" className="bg-white w-[210mm] min-h-[297mm] flex flex-col">
          {renderReport()}
        </div>
      </div>
    </>
  );
};

export default ReportPDF;