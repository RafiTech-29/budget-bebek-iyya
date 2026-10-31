import React from 'react';
import { formatIDR } from '../data/initialData';

interface SummaryCardsProps {
  previousMonthBudgetRemaining: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  budgetTotal: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  previousMonthBudgetRemaining,
  totalIncome,
  totalExpense,
  totalSavings,
  budgetTotal,
}) => {
  // Sisa Saldo Kas Aktif = Sisa budget bulan sebelumnya + Total Pemasukan - Total Pengeluaran - Total Tabungan
  const sisaSaldo = previousMonthBudgetRemaining + totalIncome - totalExpense - totalSavings;

  const expensePercentage =
    budgetTotal > 0 ? Math.round((totalExpense / budgetTotal) * 100) : 0;
  const savingsRatio =
    totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 mb-5">
      {/* 1. SISA SALDO DITAMPILKAN DALAM BENTUK LEBIH BESAR SEBAGAI POINT UTAMA */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 lg:p-7 shadow-sm border border-surface-container-highest flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-2xl sm:text-3xl shadow-xs shrink-0">
            🐥
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] sm:text-xs font-bold text-outline uppercase tracking-wider">
                Laporan Utama • Sisa Saldo
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-extrabold">
                Aman
              </span>
            </div>
            {/* Sisa Saldo Paling Besar */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight font-nunito break-all sm:break-normal">
              {formatIDR(sisaSaldo)}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs text-outline font-semibold">Status Finansial</span>
          <span className="text-sm font-bold text-on-surface flex items-center gap-1 mt-0.5">
            <span>Sehat & Cukup</span>
            <span>✨</span>
          </span>
        </div>
      </div>

      {/* 2. URUTAN: JUMLAH PEMASUKAN -> JUMLAH PENGELUARAN -> JUMLAH TABUNGAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Jumlah Pemasukan */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 shadow-2xs border border-surface-container-highest flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-outline">Jumlah Pemasukan</span>
            <div className="text-2xl font-black text-primary tracking-tight font-nunito mt-0.5">
              +{formatIDR(totalIncome)}
            </div>
            <p className="text-[11px] text-primary font-bold mt-0.5">
              Gaji & kas masuk bulan aktual
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-xl shadow-2xs">
            🐣
          </div>
        </div>

        {/* Card 2: Jumlah Pengeluaran */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 shadow-2xs border border-surface-container-highest flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-outline">Jumlah Pengeluaran</span>
            <div className="text-2xl font-black text-secondary tracking-tight font-nunito mt-0.5">
              −{formatIDR(totalExpense)}
            </div>
            <p className="text-[11px] font-semibold text-outline mt-0.5">
              {expensePercentage}% dari total jatah
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-secondary-container flex items-center justify-center text-xl shadow-2xs">
            💸
          </div>
        </div>

        {/* Card 3: Jumlah Tabungan */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 shadow-2xs border border-surface-container-highest flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-outline">Jumlah Tabungan</span>
            <div className="text-2xl font-black text-on-surface tracking-tight font-nunito mt-0.5">
              {formatIDR(totalSavings)}
            </div>
            <p className="text-[11px] font-bold text-tertiary mt-0.5">
              {savingsRatio > 0 ? `Rasio tabungan ${savingsRatio}%` : 'Tabungan terkumpul'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-xl shadow-2xs">
            🪙
          </div>
        </div>
      </div>
    </div>
  );
};
