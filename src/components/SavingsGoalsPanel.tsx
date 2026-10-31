import React from 'react';
import { SavingsGoal } from '../types';
import { formatIDR } from '../data/initialData';

interface SavingsGoalsPanelProps {
  goals: SavingsGoal[];
  totalSavings: number;
  onOpenAddGoal: () => void;
  onQuickCoinDeposit: () => void;
  onViewAll?: () => void;
}

export const SavingsGoalsPanel: React.FC<SavingsGoalsPanelProps> = ({
  goals,
  totalSavings,
  onOpenAddGoal,
  onQuickCoinDeposit,
  onViewAll,
}) => {
  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl p-4 lg:p-5 shadow-sm border border-surface-container-highest flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <h2 className="text-base font-bold text-on-surface">Celengan Si Bebek</h2>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs text-primary hover:underline font-bold cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        {/* Mascot Speech Bubble Card */}
        <div className="bg-tertiary-fixed/30 rounded-xl p-3 flex items-start gap-2.5 border-l-4 border-tertiary">
          <span className="material-symbols-outlined text-tertiary text-[22px] flex-shrink-0 mt-0.5">
            sentiment_satisfied
          </span>
          <p className="text-xs text-on-surface leading-snug font-semibold">
            "Tabungan hari ini adalah kenyamanan finansial di masa depan. Konsisten walau 20 ribu
            sehari ya, Si Bebek!" ♡
          </p>
        </div>

        {/* Saldo Tabungan Banner */}
        <div className="bg-primary-container text-on-primary rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
            <div>
              <span className="text-[11px] text-on-primary-container font-semibold">
                Saldo Celengan Saat Ini
              </span>
              <div className="text-xl font-extrabold text-on-primary">
                {formatIDR(totalSavings)}
              </div>
            </div>
          </div>
          <button
            onClick={onOpenAddGoal}
            type="button"
            className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary text-xs font-bold hover:bg-surface-container transition-colors shadow-2xs active:scale-95 cursor-pointer"
          >
            + Tambah Target
          </button>
        </div>

        {/* Target Keuangan (Goals list) */}
        <div className="flex flex-col gap-2.5">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
            return (
              <div
                key={goal.id}
                className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container-highest hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ color: goal.color }}
                    >
                      {goal.icon}
                    </span>
                    <span className="text-xs font-bold text-on-surface">{goal.title}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-bold">
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: goal.color }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-outline">
                  <span className="font-bold text-on-surface">
                    {formatIDR(goal.current)} / {formatIDR(goal.target)}
                  </span>
                  <span>Target: {goal.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Top Up Action */}
        <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">add_task</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Celengan Koin Harian</span>
              <span className="text-[11px] text-outline font-semibold">Sisa uang kembalian</span>
            </div>
          </div>
          <button
            onClick={onQuickCoinDeposit}
            type="button"
            className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-transform active:scale-95 cursor-pointer shadow-2xs shadow-[0_2px_0_#1b3221]"
          >
            + Rp 10.000
          </button>
        </div>
      </section>

      {/* Extra Widget: Inspirasi Jurnal */}
      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-highest flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-primary text-xs font-bold">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
          <span>Tips Hemat Minggu Ini</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
          Membawa botol minum sendiri dan membuat kopi di kos berhasil menghemat sekitar Rp 150.000
          tiap minggunya lho, Si Bebek! ☕✨
        </p>
      </section>
    </>
  );
};
