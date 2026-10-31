import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      aria-label="Navigasi Bawah Si Bebek"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container-highest shadow-[0_-4px_20px_rgba(75,73,61,0.08)] lg:hidden pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1.5 px-2"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Tab 1: Insight Si Bebek */}
        <button
          onClick={() => onTabChange('insights')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'insights'
              ? 'text-primary font-black scale-105'
              : 'text-outline hover:text-on-surface font-semibold'
          }`}
        >
          <span className="text-xl">🐥</span>
          <span className="text-[10px] mt-0.5 leading-tight">Insight</span>
        </button>

        {/* Tab 2: Jatah Si Bebek */}
        <button
          onClick={() => onTabChange('alokasi')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'alokasi'
              ? 'text-primary font-black scale-105'
              : 'text-outline hover:text-on-surface font-semibold'
          }`}
        >
          <span className="text-xl">🐣</span>
          <span className="text-[10px] mt-0.5 leading-tight">Jatah</span>
        </button>

        {/* Center Button: Input Jajan Bebek */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => onTabChange('input-jajan')}
            className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer border-2 ${
              activeTab === 'input-jajan'
                ? 'bg-secondary text-on-secondary border-amber-300 ring-4 ring-secondary/20 shadow-amber-900/20 scale-105'
                : 'bg-primary text-on-primary border-primary-container hover:scale-105 shadow-[0_4px_12px_rgba(45,74,52,0.35)]'
            }`}
            title="Catat Pengeluaran & Pemasukan"
          >
            <span className="text-2xl leading-none">➕</span>
          </button>
          <span
            className={`text-[10px] font-extrabold mt-1 leading-tight ${
              activeTab === 'input-jajan' ? 'text-secondary' : 'text-primary'
            }`}
          >
            Catat
          </span>
        </div>

        {/* Tab 3: Catatan Si Bebek */}
        <button
          onClick={() => onTabChange('catatan')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'catatan'
              ? 'text-primary font-black scale-105'
              : 'text-outline hover:text-on-surface font-semibold'
          }`}
        >
          <span className="text-xl">🐤</span>
          <span className="text-[10px] mt-0.5 leading-tight">Catatan</span>
        </button>

        {/* Tab 4: Tabungan Si Bebek */}
        <button
          onClick={() => onTabChange('tabungan')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'tabungan' || (activeTab as string) === 'celengan'
              ? 'text-primary font-black scale-105'
              : 'text-outline hover:text-on-surface font-semibold'
          }`}
        >
          <span className="text-xl">🪙</span>
          <span className="text-[10px] mt-0.5 leading-tight">Tabungan</span>
        </button>
      </div>
    </nav>
  );
};
