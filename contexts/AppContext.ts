import React, { createContext } from 'react';
import { PatientReport, StockItem, IndicatorRecord, ReportFormData } from '../types';

interface IAppContext {
  reports: PatientReport[];
  stock: StockItem[];
  indicators: IndicatorRecord[];
  isInventoryUnlocked: boolean;
  setIsInventoryUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Report Actions
  addReport: (reportData: ReportFormData) => Promise<void>;
  updateReport: (reportId: number, reportData: PatientReport) => Promise<void>;
  deleteReport: (reportId: number) => Promise<void>;

  // Stock Actions
  addStockItem: (itemData: Omit<StockItem, 'id'>) => Promise<void>;
  updateStockItem: (itemId: number, itemData: Omit<StockItem, 'id'>) => Promise<void>;
  deleteStockItem: (itemId: number) => Promise<void>;

  // Indicator Actions
  addIndicator: (indicatorData: Omit<IndicatorRecord, 'id'>) => Promise<void>;
  updateIndicator: (indicatorId: number, indicatorData: Omit<IndicatorRecord, 'id'>) => Promise<void>;
  deleteIndicator: (indicatorId: number) => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  reports: [],
  stock: [],
  indicators: [],
  isInventoryUnlocked: false,
  setIsInventoryUnlocked: () => {},
  addReport: async () => {},
  updateReport: async () => {},
  deleteReport: async () => {},
  addStockItem: async () => {},
  updateStockItem: async () => {},
  deleteStockItem: async () => {},
  addIndicator: async () => {},
  updateIndicator: async () => {},
  deleteIndicator: async () => {},
});