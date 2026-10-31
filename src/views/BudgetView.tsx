import React, { useState } from 'react';
import { BudgetCategory } from '../types';
import { formatIDR, formatRibuan, parseIDRInput } from '../data/initialData';

interface BudgetViewProps {
  budgets: BudgetCategory[];
  totalExpense: number;
  onUpdateBudget: (id: string, newBudget: number) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budgets,
  totalExpense,
  onUpdateBudget,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const totalBudget = budgets
    .filter((b) => !b.isParent)
    .reduce((sum, b) => sum + b.budget, 0);

  const totalRemaining = Math.max(0, totalBudget - totalExpense);
  const daysLeftInMonth = 6;
  const dailySafeSpend = Math.round(totalRemaining / daysLeftInMonth);

  const startEdit = (b: BudgetCategory) => {
    setEditingId(b.id);
    setEditValue(formatRibuan(b.budget));
  };

  const saveEdit = (id: string) => {
    const num = parseIDRInput(editValue);
    if (num > 0) {
      onUpdateBudget(id, num);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-xs">
            <span className="material-symbols-outlined text-[24px]">pie_chart</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface">Anggaran Si Bebek (Oktober 2026)</h1>
            <p className="text-xs text-outline font-semibold">
              Atur batas aman pengeluaran agar tetap tenang sampai akhir bulan bersama Si Bebek ♡
            </p>
          </div>
        </div>

        {/* Safe Spend Badge */}
        <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-highest flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-outline">Batas Aman Belanja Harian</span>
            <span className="text-sm font-extrabold text-primary">{formatIDR(dailySafeSpend)} / hari</span>
          </div>
        </div>
      </div>

      {/* Top 3 Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-2xs">
          <span className="text-xs font-bold text-outline">Total Plafon Anggaran</span>
          <div className="text-xl font-extrabold text-on-surface mt-1">{formatIDR(totalBudget)}</div>
          <p className="text-[11px] text-outline font-semibold mt-0.5">Semua pos alokasi Si Bebek</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-2xs">
          <span className="text-xs font-bold text-outline">Realisasi Terpakai</span>
          <div className="text-xl font-extrabold text-secondary mt-1">{formatIDR(totalExpense)}</div>
          <p className="text-[11px] text-secondary font-bold mt-0.5">
            {Math.round((totalExpense / totalBudget) * 100)}% dari batas aman
          </p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-2xs">
          <span className="text-xs font-bold text-outline">Sisa Anggaran Tersisa</span>
          <div className="text-xl font-extrabold text-primary mt-1">{formatIDR(totalRemaining)}</div>
          <p className="text-[11px] text-primary font-bold mt-0.5">Aman untuk 6 hari ke depan</p>
        </div>
      </div>

      {/* Category List */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <h2 className="text-base font-bold text-on-surface">Rincian Pos Anggaran Si Bebek</h2>
          <span className="text-xs text-outline font-semibold">Klik nominal anggaran untuk mengubah batas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const pct = Math.min(100, Math.round((b.spent / b.budget) * 100));
            const isNearLimit = pct >= 80 && pct < 100;
            const isOverLimit = pct >= 100;

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all ${
                  b.isParent
                    ? 'bg-surface-container-low border-primary/30 md:col-span-2'
                    : 'bg-surface-container-lowest border-surface-container-highest hover:bg-surface-container-low/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: b.color }}
                    ></span>
                    <span className="text-sm font-bold text-on-surface">{b.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOverLimit && (
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold">
                        Penuh (100%)
                      </span>
                    )}
                    {isNearLimit && (
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary text-[10px] font-bold">
                        Mendekati Batas
                      </span>
                    )}
                    <span className="text-xs font-bold text-on-surface-variant">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden my-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isOverLimit ? '#dc2626' : b.color,
                    }}
                  ></div>
                </div>

                {/* Budget Details & Quick Edit */}
                <div className="flex items-center justify-between text-xs font-semibold pt-1">
                  <span className="text-outline">
                    Terpakai: <strong className="text-on-surface">{formatIDR(b.spent)}</strong>
                  </span>

                  {editingId === b.id ? (
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex items-center">
                        <span className="absolute left-2 text-[10px] font-bold text-outline select-none">
                          Rp
                        </span>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(formatRibuan(e.target.value))}
                          placeholder="500.000"
                          className="w-28 h-7 pl-6 pr-2 text-xs rounded-lg bg-surface-container-low text-on-surface font-bold border border-primary focus:ring-1 focus:ring-primary text-primary"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => saveEdit(b.id)}
                        className="px-2 py-1 rounded bg-primary text-on-primary text-[11px] font-bold cursor-pointer hover:bg-primary-container"
                        title="Simpan"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 rounded bg-surface-container text-on-surface text-[11px] cursor-pointer hover:bg-surface-container-high"
                        title="Batal"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(b)}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      title="Klik untuk mengubah batas anggaran"
                    >
                      <span>Batas: {formatIDR(b.budget)}</span>
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
