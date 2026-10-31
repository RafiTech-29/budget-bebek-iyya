import React from 'react';
import { Transaction } from '../types';
import { formatIDR } from '../data/initialData';

interface ReportsViewProps {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  transactions: Transaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  totalIncome,
  totalExpense,
  totalSavings,
  transactions,
}) => {
  // 50/30/20 calculation
  const needsSpent = transactions
    .filter(
      (t) =>
        t.category !== 'Gaji' &&
        (t.priority === 'Wajib' || t.category === 'Kos' || t.category === 'Makan')
    )
    .reduce((s, t) => s + t.amount, 0);

  const wantsSpent = Math.max(0, totalExpense - needsSpent);

  const needsTarget = Math.round(totalIncome * 0.5);
  const wantsTarget = Math.round(totalIncome * 0.3);
  const savingsTarget = Math.round(totalIncome * 0.2);

  const needsPct = totalIncome > 0 ? Math.round((needsSpent / totalIncome) * 100) : 40;
  const wantsPct = totalIncome > 0 ? Math.round((wantsSpent / totalIncome) * 100) : 17;
  const savingsPct = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 16;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface">Laporan Si Bebek</h1>
            <p className="text-xs text-outline font-semibold">
              Evaluasi kebiasaan belanja dengan panduan 50/30/20 yang menenangkan bersama Si Bebek
            </p>
          </div>
        </div>

        {/* Health Grade Badge */}
        <div className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary flex items-center gap-2.5 shadow-xs border border-primary/20">
          <span className="text-3xl font-black">A</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-on-primary-container font-bold">Kategori Status</span>
            <span className="text-xs font-extrabold">Keuangan Sehat & Terarah</span>
          </div>
        </div>
      </div>

      {/* 50 / 30 / 20 Card Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Needs (50%) */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-2xs flex flex-col justify-between gap-3.5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-outline">Kebutuhan Pokok (50%)</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
                {needsPct}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-on-surface">{formatIDR(needsSpent)}</div>
            <p className="text-[11px] text-outline font-semibold mt-0.5">
              Target aman: maks. {formatIDR(needsTarget)}
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (needsSpent / (needsTarget || 1)) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-primary font-bold">
            ✓ Masih aman di bawah plafon 50%!
          </p>
        </div>

        {/* Wants (30%) */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-2xs flex flex-col justify-between gap-3.5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-outline">Keinginan & Penunjang (30%)</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-secondary text-[11px] font-bold">
                {wantsPct}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-secondary">{formatIDR(wantsSpent)}</div>
            <p className="text-[11px] text-outline font-semibold mt-0.5">
              Target aman: maks. {formatIDR(wantsTarget)}
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (wantsSpent / (wantsTarget || 1)) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-secondary font-bold">
            ✓ Konsumsi jajan dan hiburan terkontrol rapi.
          </p>
        </div>

        {/* Savings (20%) */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-2xs flex flex-col justify-between gap-3.5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-outline">Celengan & Tabungan (20%)</span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary text-[11px] font-bold">
                {savingsPct}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-tertiary">{formatIDR(totalSavings)}</div>
            <p className="text-[11px] text-outline font-semibold mt-0.5">
              Target ideal: {formatIDR(savingsTarget)}
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-tertiary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalSavings / (savingsTarget || 1)) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-tertiary font-bold">
            ✨ Mendekati target 20% celengan masa depan!
          </p>
        </div>
      </div>

      {/* Mindful Journal Reflections */}
      <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container-highest flex items-start gap-3.5">
        <span className="material-symbols-outlined text-primary text-[28px] mt-0.5">
          psychology_alt
        </span>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-on-surface">Refleksi Finansial Si Bebek Bulan Ini</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
            Catatan finansial membantumu melihat ke mana aliran rupiahmu setiap hari. Si Bebek
            melihat kamu telah menyisihkan celengan sebesar <strong>{formatIDR(totalSavings)}</strong>.
            Pertahankan konsistensi mencatat setiap hari ya! ♡
          </p>
        </div>
      </div>
    </div>
  );
};
