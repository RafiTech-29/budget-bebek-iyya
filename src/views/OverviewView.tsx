import React from 'react';
import {
  Transaction,
  BudgetCategory,
} from '../types';
import { SummaryCards } from '../components/SummaryCards';
import { BudgetDonutPanel } from '../components/BudgetDonutPanel';
import { AnalyticalCards } from '../components/AnalyticalCards';
import { DuckyNote } from '../components/DuckyNote';

interface OverviewViewProps {
  currentMonth: string;
  previousMonthBudgetRemaining: number;
  transactions: Transaction[];
  budgets: BudgetCategory[];
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  onOpenGuide: () => void;
  onNavigateToAlokasi?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentMonth,
  previousMonthBudgetRemaining,
  transactions,
  budgets,
  totalIncome,
  totalExpense,
  totalSavings,
  onOpenGuide,
  onNavigateToAlokasi,
}) => {
  // Hitung total anggaran secara dinamis dari kategori anggaran aktif
  const totalBudget = budgets
    .filter((b) => !b.isParent && b.enabled !== false)
    .reduce((sum, b) => sum + (b.budget || 0), 0);

  // Sisa Saldo Kas Aktif = Sisa budget bulan sebelumnya + Total pemasukan bulan aktual - Total pengeluaran bulan aktual - Total tabungan
  const sisaSaldo = previousMonthBudgetRemaining + totalIncome - totalExpense - totalSavings;

  // Analisis kategori pengeluaran terbesar secara dinamis dari transaksi aktual
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.category !== 'Gaji' && t.type !== 'Pemasukan' && t.type !== 'Tabungan')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  let topCatName = 'Belum Ada';
  let topCatAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount > topCatAmount) {
      topCatName = cat;
      topCatAmount = amount;
    }
  });

  const topCatPct = totalExpense > 0 ? Math.round((topCatAmount / totalExpense) * 100) : 0;
  const savingsRatio = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 w-full">
      {/* Top Meta Breadcrumb & Info Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-base shadow-2xs">
            🐥
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-outline font-semibold">Jurnal</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-extrabold">Insight Si Bebek</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              {currentMonth}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-semibold shadow-2xs border border-surface-container-highest">
            <span>🐾</span>
            <span>Pembukuan Aktif Si Bebek</span>
          </div>
          <button
            onClick={onOpenGuide}
            type="button"
            className="flex items-center gap-1 text-primary hover:text-on-primary-fixed-variant text-xs font-bold px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-container-highest"
          >
            <span>🐥</span>
            <span>Panduan Bebek</span>
          </button>
        </div>
      </div>

      {/* 1. INFORMASI SISA SALDO (NOMINAL SAJA) & 3 KARTU KEUANGAN */}
      <SummaryCards
        previousMonthBudgetRemaining={previousMonthBudgetRemaining}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalSavings={totalSavings}
        budgetTotal={totalBudget}
      />

      {/* 2. GRAFIK ANGGARAN BEBEK (DONUT CHART BERPROPORSI BERSIH DENGAN NOMINAL TERPAKAI & SISA SALDO) */}
      <BudgetDonutPanel
        totalSpent={totalExpense}
        totalBudget={totalBudget}
        sisaSaldo={sisaSaldo}
        onNavigateToAlokasi={onNavigateToAlokasi}
      />

      {/* 3. POINT-POINT METRIK PENTING (DIHITUNG DARI DATA AKTUAL) */}
      <AnalyticalCards
        topCategoryName={topCatName}
        topCategoryAmount={topCatAmount}
        topCategoryPct={topCatPct}
        estimatedEndingBalance={sisaSaldo}
        savingsRatio={savingsRatio}
        totalExpense={totalExpense}
      />

      {/* 4. CATATAN SI BEBEK */}
      <DuckyNote />
    </div>
  );
};
