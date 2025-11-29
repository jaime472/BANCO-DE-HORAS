
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Page, StockItem, TestType } from '../types';
import { AlertIcon, DocumentTextIcon, PlusIcon } from './icons/Icons';

interface DashboardCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactElement;
  colorClass: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, colorClass }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-3d hover:shadow-3d-hover transition-all duration-300 flex items-center space-x-4 border border-gray-700/50 transform hover:-translate-y-1`}>
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            {value}
        </div>
    </div>
);


const Dashboard: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
  const { reports, stock } = useContext(AppContext);

  const lowStockItems = stock.filter(item => item.quantity <= 5);
  const recentReports = reports.slice(0, 5);

  const stockByType = useMemo(() => {
    return stock.reduce((acc, item) => {
      // Normalização para agrupar nomes antigos/diferentes sob o mesmo TestType
      let key = item.test_type;
      const upperType = item.test_type.toUpperCase();
      
      if (key === TestType.DENGUE || upperType.includes('DENGUE')) key = TestType.DENGUE;
      else if (key === TestType.COVID || upperType.includes('COVID')) key = TestType.COVID;
      else if (key === TestType.HCG || upperType.includes('HCG') || upperType.includes('GRAVIDEZ') || upperType.includes('BETA')) key = TestType.HCG;

      acc[key] = (acc[key] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [stock]);

  const stockBreakdown = (
    <div className="mt-1">
      <div className="text-base font-semibold space-y-1">
        {Object.values(TestType).map((type) => (
          <div key={type} className="flex justify-between items-center">
            <span className="text-gray-300 text-sm font-medium">{type.split(' - ')[0]}:</span>
            <span className="text-white text-lg">{stockByType[type] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white tracking-wider">Dashboard</h1>
        <button onClick={() => setPage('reports')} className="bg-brand-secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-200 transform hover:scale-105 shadow-lg">
            <PlusIcon /> <span className="ml-2">Novo Laudo</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total de Laudos" value={<p className="text-2xl font-bold text-white">{reports.length}</p>} icon={<DocumentTextIcon />} colorClass="bg-brand-primary/30" />
        <DashboardCard title="Itens em Estoque" value={stockBreakdown} icon={<AlertIcon />} colorClass="bg-brand-accent/30" />
        <DashboardCard title="Estoque Baixo" value={<p className="text-2xl font-bold text-white">{lowStockItems.length}</p>} icon={<AlertIcon />} colorClass={lowStockItems.length > 0 ? "bg-danger/30" : "bg-warning/30"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-3d border border-gray-700/50 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-brand-accent">Alerta de Estoque Baixo</h2>
          {lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map((item: StockItem) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">{item.test_type.split(' - ')[0]}</p>
                    <p className="text-sm text-gray-400">Lote: {item.lote}</p>
                  </div>
                  <span className="bg-danger text-white text-sm font-bold px-3 py-1 rounded-full">{item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Nenhum item com estoque baixo.</p>
          )}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-3d border border-gray-700/50 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-brand-accent">Laudos Recentes</h2>
           {recentReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/20">
                  <tr className="border-b border-gray-600">
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Paciente</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Tipo de Teste</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(report => (
                    <tr key={report.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-4 px-4 font-semibold text-white">{report.patient_name}</td>
                      <td className="py-4 px-4 text-gray-300">{report.test_type.split(' - ')[1] || report.test_type}</td>
                      <td className="py-4 px-4 text-gray-300">{new Date(report.report_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">Nenhum laudo cadastrado ainda.</p>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <img 
          src="https://www.tjpb.jus.br/sites/default/files/media/2022/12/WhatsApp_Image_2022-12-01_at_10.37.10.jpeg" 
          alt="Campanha de conscientização sobre violência contra a mulher"
          className="rounded-lg shadow-3d w-full h-64 object-cover border border-gray-700/50"
        />
      </div>

    </div>
  );
};

export default Dashboard;
