import React from 'react';
import { formatIDR } from '../data/initialData';

interface AnalyticalCardsProps {
  topCategoryName?: string;
  topCategoryAmount?: number;
  topCategoryPct?: number;
  estimatedEndingBalance?: number;
  savingsRatio?: number;
  totalExpense?: number;
}

export const AnalyticalCards: React.FC<AnalyticalCardsProps> = ({
  topCategoryName = 'Belum Ada',
  topCategoryAmount = 0,
  topCategoryPct = 0,
  estimatedEndingBalance = 0,
  savingsRatio = 0,
  totalExpense = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
      {/* 1. Kategori Terbesar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-outline">Kategori Terbesar</span>
          <div className="w-6 h-6 rounded-lg bg-secondary-container flex items-center justify-center text-xs">
            🐥
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-on-surface">
            {topCategoryAmount > 0 ? topCategoryName : 'Belum Ada Transaksi'}
          </div>
          <p className="text-xs text-secondary font-bold mt-0.5">
            {topCategoryAmount > 0 ? `${formatIDR(topCategoryAmount)} (${topCategoryPct}%)` : 'Rp 0'}
          </p>
        </div>
      </div>

      {/* 2. Status Pengeluaran Bulan Ini */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-outline">Status Pengeluaran</span>
          <div className="w-6 h-6 rounded-lg bg-secondary-container flex items-center justify-center text-xs">
            📊
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-on-surface font-nunito">
              {formatIDR(totalExpense)}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-outline mt-0.5">
            {totalExpense > 0 ? 'Total pengeluaran tercatat' : 'Belum ada pengeluaran'}
          </p>
        </div>
      </div>

      {/* 3. Estimasi Saldo Akhir */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-outline">Sisa Saldo Berjalan</span>
          <div className="w-6 h-6 rounded-lg bg-primary-fixed flex items-center justify-center text-xs">
            🐣
          </div>
        </div>
        <div>
          <div className="text-sm font-extrabold text-primary font-nunito">
            {formatIDR(estimatedEndingBalance)}
          </div>
          <p className="text-[11px] font-semibold text-outline mt-0.5">
            {estimatedEndingBalance >= 0 ? 'Posisi kas terkendali' : 'Posisi kas defisit'}
          </p>
        </div>
      </div>

      {/* 4. Rasio Tabungan */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-outline">Rasio Tabungan</span>
          <div className="w-6 h-6 rounded-lg bg-tertiary-fixed flex items-center justify-center text-xs">
            🪙
          </div>
        </div>
        <div>
          <div className="text-sm font-extrabold text-tertiary">{savingsRatio}%</div>
          <p className="text-[11px] font-bold text-outline mt-0.5">
            {savingsRatio >= 15 ? 'Target sehat tercapai ✨' : 'Target min. 15% pemasukan'}
          </p>
        </div>
      </div>
    </div>
  );
};
