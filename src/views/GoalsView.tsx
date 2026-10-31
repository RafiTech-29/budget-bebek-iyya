import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { formatIDR, formatRibuan, parseIDRInput } from '../data/initialData';

interface GoalsViewProps {
  goals: SavingsGoal[];
  totalSavings: number;
  totalIncome?: number;
  totalExpense?: number;
  previousMonthBudgetRemaining?: number;
  onOpenAddGoal: () => void;
  onDepositToGoal: (goalId: string, amount: number) => void;
  onQuickCoinDeposit: () => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  totalSavings,
  totalIncome = 0,
  totalExpense = 0,
  previousMonthBudgetRemaining = 0,
  onOpenAddGoal,
  onDepositToGoal,
  onQuickCoinDeposit,
  onDeleteGoal,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
  const [depositAmountStr, setDepositAmountStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sisa Saldo Kas Aktif Realtime = Sisa budget bulan sebelumnya + Total Pemasukan - Total Pengeluaran - Total Tabungan
  const sisaSaldoRealtime = previousMonthBudgetRemaining + totalIncome - totalExpense - totalSavings;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || isSubmitting) return;
    const amount = parseIDRInput(depositAmountStr);
    if (amount <= 0) return;

    setIsSubmitting(true);
    onDepositToGoal(selectedGoalId, amount);
    setSelectedGoalId(null);
    setDepositAmountStr('');
    setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/40 border-2 border-tertiary/30 shadow-xs shrink-0 flex items-center justify-center text-3xl">
            <span>🪙</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-on-surface">Tabungan Si Bebek</h1>
              <span className="text-sm">🪙</span>
            </div>
            <p className="text-xs text-outline font-semibold">
              Kumpulkan dana dan rupiah demi impian masa depan bersama Si Bebek ♡
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onQuickCoinDeposit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold hover:bg-tertiary-fixed-dim transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <span>🪙</span>
            <span>+ Tabung Koin (Rp 10.000)</span>
          </button>

          <button
            onClick={onOpenAddGoal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all cursor-pointer shadow-sm active:scale-95 shadow-[0_2px_0_#1b3221]"
          >
            <span>🐥</span>
            <span>+ Buat Tabungan Baru</span>
          </button>
        </div>
      </div>

      {/* Kartu Tunggal: Jumlah Tabungan Si Bebek */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-sm border border-surface-container-highest flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center text-3xl shadow-xs">
            🪙
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-outline uppercase tracking-wider">
                Total Jumlah Tabungan Si Bebek
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-extrabold">
                {goals.length} Target Aktif
              </span>
            </div>
            {/* Jumlah Tabungan Besar */}
            <div className="text-3xl lg:text-4xl font-black text-on-surface tracking-tight font-nunito">
              {formatIDR(totalSavings)}
            </div>
            <p className="text-xs text-outline font-semibold mt-1">
              Total seluruh simpanan dan koin celengan Si Bebek
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-container">
          <span className="text-xs text-outline font-semibold">Sisa Saldo Kas Bebek</span>
          <span className="text-base sm:text-lg font-black text-primary font-nunito mt-0.5">
            {formatIDR(sisaSaldoRealtime)}
          </span>
          <span className="text-[11px] text-outline mt-0.5">
            Terpotong otomatis saat menabung ✨
          </span>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-surface-container-lowest p-10 rounded-2xl border border-surface-container-highest shadow-sm text-center flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">🐣</span>
          <h3 className="text-base font-extrabold text-on-surface">Belum ada target tabungan Si Bebek</h3>
          <p className="text-xs text-outline font-medium max-w-md">
            Mulai rencanakan impianmu, misalnya Dana Darurat, Liburan, Gadget Baru, atau Tabungan Bebas Finansial!
          </p>
          <button
            onClick={onOpenAddGoal}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all cursor-pointer shadow-sm active:scale-95 shadow-[0_2px_0_#1b3221]"
          >
            <span>✨ Mulai Buat Tabungan Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const isCompleted = g.current >= g.target;
            const remaining = Math.max(0, g.target - g.current);

            return (
              <div
                key={g.id}
                className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-2xs flex flex-col justify-between gap-4 hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{g.icon || '🪙'}</span>
                      <h4 className="text-sm font-bold text-on-surface">{g.title}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {isCompleted ? 'Tercapai! 🎉' : `${pct}%`}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs mt-3 mb-1">
                    <span className="font-extrabold text-primary font-nunito text-base">
                      {formatIDR(g.current)}
                    </span>
                    <span className="text-outline font-medium">
                      Target: {formatIDR(g.target)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-outline font-medium mt-2">
                    <span>🗓️ Target: {g.deadline}</span>
                    <span>Sisa: {formatIDR(remaining)}</span>
                  </div>
                </div>

                {/* Action Bar: Hapus & Setor */}
                <div className="pt-2 border-t border-surface-container flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalToDelete(g)}
                    className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-rose-500/15 text-rose-700 hover:text-rose-800 transition-all cursor-pointer text-xs font-bold flex items-center gap-1 border border-surface-container-highest active:scale-95"
                    title="Hapus tabungan ini jika batal menabung"
                  >
                    <span>🗑️</span>
                    <span>Hapus Tabungan</span>
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => {
                        setSelectedGoalId(g.id);
                        setDepositAmountStr('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>🪙</span>
                      <span>Setor Dana Bebek</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Setor Dana Modal */}
      {selectedGoalId && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-surface-container-lowest rounded-2xl p-5 w-full max-w-sm shadow-xl border border-surface-container-highest flex flex-col gap-3.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <h3 className="text-sm font-bold text-on-surface">Setor Dana ke Tabungan</h3>
              </div>
              <button
                onClick={() => setSelectedGoalId(null)}
                className="w-7 h-7 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeposit} className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs">
                <span className="text-outline font-semibold">Sisa Saldo Kas Aktif:</span>
                <span className="font-extrabold text-primary font-nunito">{formatIDR(sisaSaldoRealtime)}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-outline">Nominal Setoran (Rp)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs font-bold text-outline select-none">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={depositAmountStr}
                    onChange={(e) => setDepositAmountStr(formatRibuan(e.target.value))}
                    placeholder="Contoh: 1.000.000"
                    autoFocus
                    className="w-full h-9 pl-8 pr-3 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container-highest focus:ring-2 focus:ring-primary text-primary"
                    required
                  />
                </div>
                {/* Quick Chips */}
                <div className="flex flex-wrap items-center gap-1 pt-1.5">
                  <span className="text-[10px] text-outline font-semibold">Tambah cepat:</span>
                  {[50000, 100000, 500000, 1000000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        const cur = parseIDRInput(depositAmountStr);
                        setDepositAmountStr(formatRibuan(cur + v));
                      }}
                      className="px-2 py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-[10px] font-bold border border-surface-container-highest cursor-pointer active:scale-95"
                    >
                      +{formatRibuan(v)}
                    </button>
                  ))}
                  {depositAmountStr && (
                    <button
                      type="button"
                      onClick={() => setDepositAmountStr('')}
                      className="px-2 py-0.5 rounded-full text-outline hover:text-rose-600 text-[10px] font-bold cursor-pointer ml-auto"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setSelectedGoalId(null)}
                  className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || parseIDRInput(depositAmountStr) <= 0}
                  className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shadow-[0_2px_0_#1b3221] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Setor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Tabungan (Jika batal menabung) */}
      {goalToDelete && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-surface-container-lowest rounded-2xl p-5 w-full max-w-sm shadow-xl border border-surface-container-highest flex flex-col gap-3.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-700 flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-on-surface">Hapus Target Tabungan?</h3>
                <p className="text-xs text-outline font-semibold mt-0.5">
                  Batal menabung untuk target ini?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1 text-xs">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span>{goalToDelete.icon || '🪙'}</span>
                <span>{goalToDelete.title}</span>
              </span>
              <span className="text-outline">
                Target: <strong className="text-on-surface">{formatIDR(goalToDelete.target)}</strong>
              </span>
              <span className="text-outline">
                Terkumpul saat ini: <strong className="text-primary">{formatIDR(goalToDelete.current)}</strong>
              </span>
            </div>

            <p className="text-[11px] text-outline font-medium">
              Target tabungan ini akan dihapus dari daftar impian Si Bebek.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setGoalToDelete(null)}
                className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteGoal(goalToDelete.id);
                  setGoalToDelete(null);
                }}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Ya, Hapus Tabungan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
