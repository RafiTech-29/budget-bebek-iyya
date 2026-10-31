import React, { useState } from 'react';
import { BudgetCategory } from '../types';
import { formatIDR, formatRibuan, parseIDRInput } from '../data/initialData';

interface AlokasiAnggaranViewProps {
  budgets: BudgetCategory[];
  onUpdateBudget: (id: string, newBudget: number) => void;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  previousMonthBudgetRemaining?: number;
}

interface CategoryDetail {
  id: string;
  name: string;
  icon: string;
  desc: string;
  group: 'Wajib' | 'Prioritas' | 'Opsional';
}

const CATEGORY_GROUPS: {
  group: 'Wajib' | 'Prioritas' | 'Opsional';
  badge: string;
  colorClass: string;
  desc: string;
  categoryIds: string[];
}[] = [
  {
    group: 'Wajib',
    badge: 'Kebutuhan Wajib',
    colorClass: 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-300',
    desc: 'Pengeluaran primer yang mutlak harus dipenuhi setiap bulan',
    categoryIds: ['b-kos', 'b-listrik', 'b-pokok', 'b-makan', 'b-internet'],
  },
  {
    group: 'Prioritas',
    badge: 'Kebutuhan Prioritas',
    colorClass: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-300',
    desc: 'Pengeluaran penting penunjang aktivitas & produktivitas harian',
    categoryIds: ['b-transp', 'b-laundry', 'b-skincare'],
  },
  {
    group: 'Opsional',
    badge: 'Kebutuhan Opsional',
    colorClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-300',
    desc: 'Pengeluaran fleksibel untuk hiburan, santai, dan dana cadangan',
    categoryIds: ['b-hiburan', 'b-lainnya'],
  },
];

const CATEGORY_DETAILS: Record<string, { icon: string; desc: string }> = {
  'b-kos': { icon: '🏠', desc: 'Sewa kamar kos & iuran lingkungan' },
  'b-listrik': { icon: '⚡', desc: 'Token listrik PLN & tagihan utilitas' },
  'b-pokok': { icon: '🧼', desc: 'Sabun mandi & cuci, air mineral, pasta gigi, shampo dll' },
  'b-makan': { icon: '🍽️', desc: 'Makan sehari-hari, camilan & minum' },
  'b-internet': { icon: '🌐', desc: 'Paket data, wifi & pulsa handphone' },
  'b-transp': { icon: '🛵', desc: 'Bensin, ojek online & transportasi' },
  'b-laundry': { icon: '🧺', desc: 'Cuci pakaian kiloan & dry clean' },
  'b-skincare': { icon: '✨', desc: 'Perawatan diri & kebutuhan mandi' },
  'b-hiburan': { icon: '🍿', desc: 'Jajan nongkrong & healing santai' },
  'b-lainnya': { icon: '📦', desc: 'Kebutuhan tak terduga lainnya' },
};

export const AlokasiAnggaranView: React.FC<AlokasiAnggaranViewProps> = ({
  budgets,
  onUpdateBudget,
  totalIncome,
  totalExpense,
  totalSavings,
  previousMonthBudgetRemaining = 0,
}) => {
  // Sisa Saldo Realtime = Saldo sisa bulan lalu + Total pemasukan - Total pengeluaran - Total tabungan
  const sisaSaldoRealtime = previousMonthBudgetRemaining + totalIncome - totalExpense - totalSavings;

  // Local draft inputs for categories that are being filled
  const [draftInputs, setDraftInputs] = useState<Record<string, string>>({});
  // Categories that user explicitly unlocks for emergency corrections
  const [unlockedCategories, setUnlockedCategories] = useState<Record<string, boolean>>({});
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // 8 kategori standar (tanpa parent container)
  const childBudgets = budgets.filter((b) => !b.isParent);

  // Total dana masuk yang tersedia untuk dialokasikan (Pemasukan aktual + Sisa saldo bulan sebelumnya - Dana yang disisihkan ke Tabungan)
  const totalDanaTersedia = (previousMonthBudgetRemaining || 0) + totalIncome - totalSavings;

  // Total jatah belanja yang dialokasikan
  const totalAllocated = childBudgets.reduce((sum, b) => sum + (b.budget || 0), 0);

  // Sisa dana yang belum dialokasikan
  const sisaBelumDialokasikan = totalDanaTersedia - totalAllocated;

  // Total dana terpakai aktual (dihitung otomatis dari transaksi aktual Input Jajan Bebek)
  const totalSpent = childBudgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  // Sisa kuota jatah
  const remainingQuota = Math.max(0, totalAllocated - totalSpent);

  const handleDraftChange = (id: string, val: string) => {
    setDraftInputs((prev) => ({ ...prev, [id]: formatRibuan(val) }));
    if (budgetError) setBudgetError(null);
  };

  const handleLockBudget = (id: string) => {
    const rawVal = draftInputs[id];
    const numeric = parseIDRInput(rawVal);
    if (numeric <= 0) {
      setBudgetError('Masukkan nominal jatah terlebih dahulu sebelum mengunci, Si Bebek! 🐥');
      return;
    }
    setBudgetError(null);
    onUpdateBudget(id, numeric);
    setUnlockedCategories((prev) => ({ ...prev, [id]: false }));
  };

  const handleUnlockBudget = (id: string, currentBudget: number) => {
    setDraftInputs((prev) => ({ ...prev, [id]: formatRibuan(currentBudget) }));
    setUnlockedCategories((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto">
      {/* Header Banner - Jatah Si Bebek */}
      <div className="bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed/40 border-2 border-primary/30 shadow-xs shrink-0 flex items-center justify-center text-3xl">
            <span>🐣</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-on-surface">Jatah Si Bebek</h1>
              <span className="text-base">🐣</span>
            </div>
            <p className="text-xs text-outline font-semibold mt-0.5">
              Alokasikan jatah belanja untuk kategori Wajib, Prioritas, dan Opsional. Nominal yang disimpan terkunci aman.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold self-start sm:self-auto border border-primary/20">
          <span>🔒</span>
          <span>Sistem Jatah Terkunci</span>
        </div>
      </div>

      {budgetError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{budgetError}</span>
          </div>
          <button
            onClick={() => setBudgetError(null)}
            className="text-xs text-rose-600 hover:text-rose-900 font-extrabold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. SISA SALDO DITAMPILKAN DALAM BENTUK LEBIH BESAR (POINT UTAMA) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-highest flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-3xl shadow-xs">
            🐣
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-outline uppercase tracking-wider">
                Sisa Saldo Realtime
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-extrabold">
                Titik Fokus Utama
              </span>
            </div>
            {/* Sisa Saldo Paling Besar */}
            <div className="text-3xl lg:text-4xl font-black text-primary tracking-tight font-nunito">
              {formatIDR(sisaSaldoRealtime)}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs text-outline font-semibold">Status Finansial</span>
          <span className="text-sm font-bold text-on-surface flex items-center gap-1 mt-0.5">
            <span>{sisaSaldoRealtime >= 0 ? 'Surplus Aman 🌿' : 'Defisit ⚠️'}</span>
          </span>
        </div>
      </div>

      {/* 2. URUTAN: JUMLAH PEMASUKAN -> JUMLAH PENGELUARAN -> JUMLAH TABUNGAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Jumlah Pemasukan */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-outline">Jumlah Pemasukan</span>
            <div className="text-2xl font-black text-primary font-nunito mt-0.5">
              +{formatIDR(totalIncome)}
            </div>
            <p className="text-[11px] text-outline font-semibold mt-0.5">
              Total dana masuk
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-xl shadow-2xs">
            🐣
          </div>
        </div>

        {/* Card 2: Jumlah Pengeluaran */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-outline">Jumlah Pengeluaran</span>
            <div className="text-2xl font-black text-secondary font-nunito mt-0.5">
              −{formatIDR(totalExpense)}
            </div>
            <p className="text-[11px] text-outline font-semibold mt-0.5">
              Total dana terpakai
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-secondary-container flex items-center justify-center text-xl shadow-2xs">
            💸
          </div>
        </div>

        {/* Card 3: Jumlah Tabungan */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-outline">Jumlah Tabungan</span>
            <div className="text-2xl font-black text-on-surface font-nunito mt-0.5">
              {formatIDR(totalSavings)}
            </div>
            <p className="text-[11px] text-outline font-semibold mt-0.5">
              Simpanan impian Si Bebek
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-xl shadow-2xs">
            🪙
          </div>
        </div>
      </div>

      {/* 3. SAJIAN INFORMASI ALOKASI ANGGARAN BEBEK */}
      <div className="bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col gap-4.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-2xs">
              📊
            </div>
            <div>
              <h2 className="text-base font-extrabold text-on-surface">Status Alokasi Anggaran Si Bebek</h2>
              <p className="text-xs text-outline font-semibold">
                Pantau total dana yang sudah dialokasikan ke pos belanja dan sisa dana yang masih bebas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-highest">
            <span className="text-xs font-bold text-outline">Total Dana Tersedia:</span>
            <span className="text-xs font-black text-on-surface font-nunito">
              {formatIDR(totalDanaTersedia)}
            </span>
          </div>
        </div>

        {/* 2 Kartu Utama: Total Dana Dialokasikan & Sisa Dana Belum Dialokasikan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kartu 1: Total Dana yang Dialokasikan */}
          <div className="p-4.5 rounded-2xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-2xl shadow-xs shrink-0">
                💼
              </div>
              <div>
                <span className="text-xs font-bold text-outline block">
                  Total Dana yang Dialokasikan
                </span>
                <span className="text-2xl sm:text-3xl font-black text-primary font-nunito tracking-tight">
                  {formatIDR(totalAllocated)}
                </span>
                <p className="text-[11px] text-outline font-semibold mt-0.5">
                  Dialokasikan ke {childBudgets.filter((b) => b.budget > 0).length} pos belanja Si Bebek
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold self-start shadow-2xs">
              {totalDanaTersedia > 0 ? Math.min(100, Math.round((totalAllocated / totalDanaTersedia) * 100)) : 0}% Terbagi
            </span>
          </div>

          {/* Kartu 2: Sisa Dana yang Belum Dialokasikan */}
          <div
            className={`p-4.5 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs ${
              sisaBelumDialokasikan > 0
                ? 'bg-amber-500/10 border-amber-300 dark:border-amber-700'
                : sisaBelumDialokasikan === 0
                ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-700'
                : 'bg-rose-500/10 border-rose-300 dark:border-rose-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                  sisaBelumDialokasikan > 0
                    ? 'bg-amber-500 text-white'
                    : sisaBelumDialokasikan === 0
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {sisaBelumDialokasikan >= 0 ? '🪙' : '⚠️'}
              </div>
              <div>
                <span className="text-xs font-bold text-outline block">
                  Sisa Dana yang Belum Dialokasikan
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black font-nunito tracking-tight ${
                    sisaBelumDialokasikan > 0
                      ? 'text-amber-800 dark:text-amber-300'
                      : sisaBelumDialokasikan === 0
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {formatIDR(Math.abs(sisaBelumDialokasikan))}
                  {sisaBelumDialokasikan < 0 && ' (Over Limit)'}
                </span>
                <p className="text-[11px] text-outline font-semibold mt-0.5">
                  {sisaBelumDialokasikan > 0
                    ? 'Dana bebas yang masih bisa kamu bagikan ke pos belanja'
                    : sisaBelumDialokasikan === 0
                    ? 'Bagus sekali! Semua dana masuk telah dialokasikan 100%'
                    : 'Peringatan: Total jatah melebihi pemasukan yang tersedia'}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold self-start shadow-2xs ${
                sisaBelumDialokasikan > 0
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200'
                  : sisaBelumDialokasikan === 0
                  ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-500/20 text-rose-900 dark:text-rose-200'
              }`}
            >
              {sisaBelumDialokasikan > 0 ? 'Sisa Bebas' : sisaBelumDialokasikan === 0 ? 'Pas 100%' : 'Over Limit'}
            </span>
          </div>
        </div>

        {/* Baris Rincian Kuota Belanja & Realisasi Terpakai */}
        <div className="pt-3 border-t border-surface-container flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-outline">
            <span>🛒 Realisasi Belanja Aktual:</span>
            <strong className="text-secondary font-black font-nunito">{formatIDR(totalSpent)}</strong>
          </div>
          <div className="flex items-center gap-2 text-outline">
            <span>🛡️ Sisa Kuota Belanja dari Jatah:</span>
            <strong className="text-primary font-black font-nunito">{formatIDR(remainingQuota)}</strong>
          </div>
        </div>
      </div>

      {/* Daftar Kategori Dikelompokkan: Wajib, Prioritas, dan Opsional */}
      <div className="flex flex-col gap-6">
        {CATEGORY_GROUPS.map((groupInfo) => {
          const groupBudgets = childBudgets.filter((b) =>
            groupInfo.categoryIds.includes(b.id)
          );

          return (
            <div
              key={groupInfo.group}
              className="bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col gap-4"
            >
              {/* Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${groupInfo.colorClass}`}>
                    {groupInfo.badge}
                  </span>
                  <span className="text-xs text-outline font-semibold hidden sm:inline">
                    • {groupInfo.desc}
                  </span>
                </div>
                <span className="text-[11px] text-outline font-bold">
                  {groupBudgets.length} Kategori
                </span>
              </div>

              {/* Category Cards within Group */}
              <div className="flex flex-col gap-3">
                {groupBudgets.map((b) => {
                  const meta = CATEGORY_DETAILS[b.id] || { icon: '📦', desc: 'Pos kebutuhan belanja' };
                  const isLocked = b.budget > 0 && !unlockedCategories[b.id];
                  const currentDraft = draftInputs[b.id] !== undefined ? draftInputs[b.id] : '';
                  const pct = b.budget > 0 ? Math.min(100, Math.round((b.spent / b.budget) * 100)) : 0;
                  const isOver = b.budget > 0 && b.spent > b.budget;
                  const remaining = Math.max(0, b.budget - b.spent);

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border border-surface-container-highest bg-surface-container-low flex flex-col gap-3 hover:border-primary/40 transition-all"
                    >
                      {/* Baris Utama: Info Kategori & Status Jatah */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Kiri: Icon, Nama, & Deskripsi */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xs border border-surface-container-highest"
                            style={{ backgroundColor: `${b.color}18` }}
                          >
                            <span>{meta.icon}</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-on-surface truncate">
                                {b.name}
                              </span>
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                                style={{ backgroundColor: b.color || '#2d4a34' }}
                              ></span>
                            </div>
                            <p className="text-[11px] text-outline font-medium truncate mt-0.5">
                              {meta.desc}
                            </p>
                          </div>
                        </div>

                        {/* Kanan: Terpakai Aktual & Form / Display Terkunci */}
                        <div className="flex flex-wrap items-center gap-4 justify-between md:justify-end">
                          {/* Terpakai Aktual dari Input Jajan Bebek */}
                          <div className="text-left md:text-right">
                            <span className="text-[10px] font-bold text-outline uppercase block tracking-wider">
                              Terpakai Aktual
                            </span>
                            <span
                              className={`text-xs font-black font-nunito ${
                                b.spent > 0 ? 'text-on-surface' : 'text-outline font-semibold'
                              }`}
                            >
                              {b.spent > 0 ? formatIDR(b.spent) : 'Rp 0 (Belum ada)'}
                            </span>
                          </div>

                          {/* Jika Jatah Sudah Diinput & Terkunci (Tidak Bisa Diubah) */}
                          {isLocked ? (
                            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-surface-container-highest">
                              <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold text-outline">Jatah Terkunci</span>
                                <span className="text-xs font-black text-primary font-nunito">
                                  {formatIDR(b.budget)}
                                </span>
                              </div>
                              <span
                                className="text-sm cursor-help"
                                title="Nominal jatah ini telah dikunci dan tidak dapat diubah sembarangan"
                              >
                                🔒
                              </span>
                              {/* Icon tombol buka kunci / koreksi jatah (hanya icon agar simpel) */}
                              <button
                                type="button"
                                onClick={() => handleUnlockBudget(b.id, b.budget)}
                                className="w-6 h-6 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-110 active:scale-95 ml-1"
                                title="Koreksi / Ubah Nominal Jatah"
                              >
                                <span className="text-xs">✏️</span>
                              </button>
                            </div>
                          ) : (
                            /* Form Input Jatah untuk Kategori yang Belum Terkunci */
                            <div className="flex items-center gap-1.5">
                              <div className="relative flex items-center w-36 sm:w-40">
                                <span className="absolute left-2.5 text-xs font-bold text-outline select-none">
                                  Rp
                                </span>
                                <input
                                  type="text"
                                  value={currentDraft}
                                  onChange={(e) => handleDraftChange(b.id, e.target.value)}
                                  placeholder="0"
                                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-lowest text-xs font-black text-on-surface border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleLockBudget(b.id)}
                                className="h-9 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-[11px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0 shadow-[0_2px_0_#1b3221]"
                                title="Kunci nominal jatah ini agar tidak dapat diubah"
                              >
                                <span>🔒</span>
                                <span>Kunci Jatah</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Baris Status Progress Jika Jatah Terpasang */}
                      {b.budget > 0 ? (
                        <div className="pt-2 border-t border-surface-container flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-outline">
                              Sisa Jatah:{' '}
                              <strong
                                className={isOver ? 'text-error font-black' : 'text-primary font-black'}
                              >
                                {isOver
                                  ? `Over ${formatIDR(b.spent - b.budget)}`
                                  : formatIDR(remaining)}
                              </strong>
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                isOver
                                  ? 'bg-error-container text-error'
                                  : b.spent === 0
                                  ? 'bg-surface-container text-outline'
                                  : 'bg-primary/10 text-primary'
                              }`}
                            >
                              {isOver
                                ? `⚠️ Melebihi Jatah (${Math.round((b.spent / b.budget) * 100)}%)`
                                : b.spent === 0
                                ? 'Belum Ada Belanja (0%)'
                                : `${pct}% Terpakai`}
                            </span>
                          </div>

                          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden shadow-inner">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: isOver ? '#ba1a1a' : b.color || '#2d4a34',
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1.5 border-t border-surface-container flex items-center justify-between text-[11px] text-outline font-semibold">
                          <span>💡 Masukkan nominal dan klik "Kunci Jatah" untuk menetapkan limit belanja kategori ini</span>
                          <span className="text-secondary font-bold">Belum Diatur</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
