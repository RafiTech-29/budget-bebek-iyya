import React from 'react';
import { formatIDR } from '../data/initialData';

interface BudgetDonutPanelProps {
  totalSpent: number;
  totalBudget: number;
  sisaSaldo?: number;
  onNavigateToAlokasi?: () => void;
}

export const BudgetDonutPanel: React.FC<BudgetDonutPanelProps> = ({
  totalSpent,
  totalBudget,
  sisaSaldo,
  onNavigateToAlokasi,
}) => {
  // Sisa Saldo aktual
  const actualSisaSaldo =
    sisaSaldo !== undefined ? sisaSaldo : Math.max(0, totalBudget - totalSpent);

  // Total dana aktif yang diperhitungkan
  const totalDana =
    actualSisaSaldo + totalSpent > 0 ? actualSisaSaldo + totalSpent : totalBudget;

  // Persentase
  const percentUsed =
    totalDana > 0 ? Math.min(100, Math.round((totalSpent / totalDana) * 100)) : 0;
  const percentRemaining = Math.max(0, 100 - percentUsed);

  // Geometri Donut
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius; // ≈ 439.82
  const strokeDashoffsetUsed = circumference - (percentUsed / 100) * circumference;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 lg:p-6 shadow-sm border border-surface-container-highest flex flex-col gap-5">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-lg shadow-2xs">
            🐥
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Grafik Anggaran Bebek</h3>
            <p className="text-xs text-outline font-semibold">
              Proporsi penggunaan dana terhadap total saldo aktif
            </p>
          </div>
        </div>

        {onNavigateToAlokasi && (
          <button
            onClick={onNavigateToAlokasi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-all border border-surface-container-highest cursor-pointer self-start sm:self-auto"
          >
            <span>🐣</span>
            <span>Buka Jatah Si Bebek →</span>
          </button>
        )}
      </div>

      {/* Main Grid: Donut Chart Berproporsi Bersih & Ringkasan Angka */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Sisi Donut Chart */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-2">
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 drop-shadow-xs"
              viewBox="0 0 200 200"
            >
              {/* Lingkaran Sisa Saldo (Warna Sage Lembut) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#a4cca9"
                strokeWidth={strokeWidth}
                className="transition-all duration-500"
              />

              {/* Segmen Dana Terpakai (Warna Hijau Utama Bebek) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#2d4a34"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffsetUsed}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Informasi di Tengah Donut: Persentase Saja (Nominal sudah ada di sebelah kanan) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <span className="text-xl mb-1">🐥</span>
              <span className="text-4xl sm:text-5xl font-black text-primary font-nunito leading-tight">
                {percentUsed}%
              </span>
              <span className="text-xs font-bold text-outline mt-1">
                Dana Terpakai
              </span>
            </div>
          </div>
        </div>

        {/* Sisi Detail Metrik Utama */}
        <div className="md:col-span-6 flex flex-col gap-3.5">
          {/* Card 1: Dana Terpakai */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-10 rounded-full bg-[#2d4a34] shadow-2xs"></div>
              <div>
                <span className="text-xs font-bold text-outline block">Dana Terpakai</span>
                <span className="text-xl font-black text-on-surface font-nunito">
                  {formatIDR(totalSpent)}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-black">
              {percentUsed}%
            </span>
          </div>

          {/* Card 2: Sisa Saldo */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-10 rounded-full bg-[#a4cca9] shadow-2xs"></div>
              <div>
                <span className="text-xs font-bold text-outline block">Sisa Saldo</span>
                <span className="text-xl font-black text-primary font-nunito">
                  {formatIDR(actualSisaSaldo)}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#a4cca9]/30 text-primary text-xs font-black">
              {percentRemaining}%
            </span>
          </div>

          {/* Card 3: Total Anggaran Bebek */}
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between text-xs font-bold text-outline">
            <span>Total Anggaran Bebek</span>
            <span className="text-on-surface font-extrabold">{formatIDR(totalBudget)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
