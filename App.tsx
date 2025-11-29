
import React, { useState, useMemo, useEffect } from 'react';
import { Page, PatientReport, StockItem, IndicatorRecord, ReportFormData } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Inventory from './components/Inventory';
import Indicators from './components/Indicators';
import { AppContext } from './contexts/AppContext';
import { supabase } from './lib/supabaseClient';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [isInventoryUnlocked, setIsInventoryUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: reportsData, error: reportsError } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
        const { data: stockData, error: stockError } = await supabase.from('stock').select('*').order('test_type', { ascending: true });
        const { data: indicatorsData, error: indicatorsError } = await supabase.from('indicators').select('*').order('date', { ascending: false });

        if (reportsError) throw new Error(`Reports Error: ${reportsError.message}`);
        if (stockError) throw new Error(`Stock Error: ${stockError.message}`);
        if (indicatorsError) throw new Error(`Indicators Error: ${indicatorsError.message}`);

        setReports(reportsData || []);
        setStock(stockData || []);
        setIndicators(indicatorsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Ocorreu um erro ao carregar os dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Helper para normalizar tipos de teste ---
  const getTestCategory = (testName: string) => {
    const upper = testName.toUpperCase();
    if (upper.includes('DENGUE')) return 'DENGUE';
    if (upper.includes('COVID')) return 'COVID';
    if (upper.includes('HCG') || upper.includes('GRAVIDEZ') || upper.includes('BETA')) return 'HCG';
    return upper;
  };

  // --- CRUD Functions ---

  // Reports
  const addReport = async (reportData: ReportFormData) => {
    // 1. Deduct stock
    // Procura o item no estoque usando o lote E verificando a categoria do teste (para compatibilidade com nomes legados)
    const stockItem = stock.find(s => 
      s.lote === reportData.lote && 
      getTestCategory(s.test_type) === getTestCategory(reportData.test_type)
    );

    if (!stockItem || stockItem.quantity <= 0) {
      throw new Error("Estoque insuficiente para o lote selecionado.");
    }
    const { error: stockError } = await supabase
      .from('stock')
      .update({ quantity: stockItem.quantity - 1 })
      .eq('id', stockItem.id);
    if (stockError) throw stockError;

    // 2. Insert report
    const { data, error } = await supabase.from('reports').insert([reportData]).select();
    if (error) throw error;

    // 3. Update state
    setStock(stock.map(s => s.id === stockItem.id ? { ...s, quantity: s.quantity - 1 } : s));
    setReports([data[0], ...reports]);
  };

  const updateReport = async (reportId: number, reportData: PatientReport) => {
      const { data, error } = await supabase.from('reports').update(reportData).eq('id', reportId).select();
      if (error) throw error;
      setReports(reports.map(r => (r.id === reportId ? data[0] : r)));
  };

  const deleteReport = async (reportId: number) => {
      const { error } = await supabase.from('reports').delete().eq('id', reportId);
      if (error) throw error;
      setReports(reports.filter(r => r.id !== reportId));
  };

  // Stock
  const addStockItem = async (itemData: Omit<StockItem, 'id'>) => {
      const { data, error } = await supabase.from('stock').insert([itemData]).select();
      if (error) throw error;
      setStock([...stock, data[0]]);
  };

  const updateStockItem = async (itemId: number, itemData: Omit<StockItem, 'id'>) => {
      const { data, error } = await supabase.from('stock').update(itemData).eq('id', itemId).select();
      if (error) throw error;
      setStock(stock.map(i => (i.id === itemId ? data[0] : i)));
  };

  const deleteStockItem = async (itemId: number) => {
      const { error } = await supabase.from('stock').delete().eq('id', itemId);
      if (error) throw error;
      setStock(stock.filter(i => i.id !== itemId));
  };

  // Indicators
  const addIndicator = async (indicatorData: Omit<IndicatorRecord, 'id'>) => {
      const { data, error } = await supabase.from('indicators').insert([indicatorData]).select();
      if (error) throw error;
      setIndicators([data[0], ...indicators]);
  };

  const updateIndicator = async (indicatorId: number, indicatorData: Omit<IndicatorRecord, 'id'>) => {
      const { data, error } = await supabase.from('indicators').update(indicatorData).eq('id', indicatorId).select();
      if (error) throw error;
      setIndicators(indicators.map(i => (i.id === indicatorId ? data[0] : i)));
  };

  const deleteIndicator = async (indicatorId: number) => {
      const { error } = await supabase.from('indicators').delete().eq('id', indicatorId);
      if (error) throw error;
      setIndicators(indicators.filter(i => i.id !== indicatorId));
  };


  const contextValue = useMemo(() => ({
    reports,
    stock,
    indicators,
    isInventoryUnlocked,
    setIsInventoryUnlocked,
    addReport,
    updateReport,
    deleteReport,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    addIndicator,
    updateIndicator,
    deleteIndicator,
  }), [reports, stock, indicators, isInventoryUnlocked]);

  const renderPage = () => {
    if (loading) {
        return <div className="flex items-center justify-center h-full text-2xl">Carregando dados...</div>;
    }
    switch (page) {
      case 'dashboard':
        return <Dashboard setPage={setPage} />;
      case 'reports':
        return <Reports />;
      case 'inventory':
        return isInventoryUnlocked ? <Inventory /> : <Dashboard setPage={setPage} />;
      case 'indicators':
        return <Indicators />;
      default:
        return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex min-h-screen bg-brand-dark font-sans">
        <Sidebar currentPage={page} setPage={setPage} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300">
            {renderPage()}
          </main>
          <footer className="text-center p-4 text-xs text-gray-500 border-t border-gray-800">
            Desenvolvido por: Jaime Eduardo | Whats: 51985502897
          </footer>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
