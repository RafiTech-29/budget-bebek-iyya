import React, { useState } from 'react';
import { CategoryType, Transaction, TransactionType } from '../types';
import { parseIDRInput, formatIDR, formatRibuan } from '../data/initialData';
import { MiniCalendarPicker } from '../components/MiniCalendarPicker';

interface InputJajanViewProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
  onNavigateToCatatan: () => void;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  previousMonthBudgetRemaining?: number;
  isModal?: boolean;
  onClose?: () => void;
}

export const InputJajanView: React.FC<InputJajanViewProps> = ({
  onAddTransaction,
  onNavigateToCatatan,
  totalIncome,
  totalExpense,
  totalSavings,
  previousMonthBudgetRemaining = 0,
  isModal = false,
  onClose,
}) => {
  // Pilihan jenis transaksi: null jika belum memilih
  // Form baru muncul ketika pengguna memilih jenis transaksi
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null);

  const getTodayFormatted = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [date, setDate] = useState(getTodayFormatted);
  const [category, setCategory] = useState<CategoryType>('Makan');
  const [description, setDescription] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [bank, setBank] = useState('BCA (Utama)');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSelectType = (newType: TransactionType) => {
    setSelectedType(newType);
    setInputError(null);
    if (newType === 'Pemasukan') {
      setCategory('Gaji');
    } else {
      setCategory('Makan');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawAmount(formatRibuan(val));
    if (inputError) setInputError(null);
  };

  const handleQuickAddAmount = (addVal: number) => {
    const current = parseIDRInput(rawAmount);
    setRawAmount(formatRibuan(current + addVal));
    if (inputError) setInputError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const amount = parseIDRInput(rawAmount);
    if (amount <= 0) {
      setInputError('Mohon masukkan nominal yang valid, Si Bebek! 🐥');
      return;
    }
    setInputError(null);

    const savedType = selectedType;
    const finalDesc = description.trim() || (savedType === 'Pemasukan' ? 'Pemasukan Bebek' : category);
    const formattedAmount = formatIDR(amount);

    // Simpan transaksi HANYA 1 KALI (Toast ditangani terpusat oleh App)
    onAddTransaction({
      date: date || getTodayFormatted(),
      category,
      description: finalDesc,
      amount,
      bank,
      type: savedType,
      loggedToJournal: true,
    });

    setDescription('');
    setRawAmount('');

    if (isModal && onClose) {
      onClose();
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 w-full relative">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container/50 border-2 border-secondary/30 shadow-xs shrink-0 flex items-center justify-center text-3xl">
            <span>🐥</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-on-surface">Input Jajan Bebek</h1>
              <span className="text-base">🐥</span>
            </div>
            <p className="text-xs text-outline font-semibold">
              Satu-satunya tempat mencatat pengeluaran & pemasukan Si Bebek ♡
            </p>
          </div>
        </div>

        {isModal ? (
          <button
            onClick={onClose || onNavigateToCatatan}
            className="px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-all border border-surface-container-highest cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>✕ Tutup Pop-up</span>
          </button>
        ) : (
          <button
            onClick={onNavigateToCatatan}
            className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-surface-container-highest cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>🐤 Buka Catatan Bebek</span>
            <span>→</span>
          </button>
        )}
      </div>



      {/* Pilihan Jenis Transaksi */}
      <div className="bg-surface-container-lowest p-5 lg:p-6 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-surface-container">
          <div>
            <h2 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
              <span>🐾</span>
              <span>Pilih Jenis Transaksi</span>
            </h2>
            <p className="text-xs text-outline font-medium mt-0.5">
              {selectedType
                ? 'Jenis transaksi aktif. Lengkapi formulir di bawah.'
                : 'Pilih jenis transaksi untuk memunculkan formulir input data.'}
            </p>
          </div>

          {selectedType && (
            <button
              type="button"
              onClick={() => setSelectedType(null)}
              className="text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer self-start sm:self-auto underline"
            >
              Tutup Formulir ✕
            </button>
          )}
        </div>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Opsi 1: Pengeluaran */}
          <button
            type="button"
            onClick={() => handleSelectType('Pengeluaran')}
            className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer group ${
              selectedType === 'Pengeluaran'
                ? 'bg-secondary-container/30 border-secondary ring-2 ring-secondary/30 shadow-xs'
                : 'bg-surface-container-low border-surface-container-highest hover:border-secondary/60 hover:bg-surface-container'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                selectedType === 'Pengeluaran'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-lowest'
              }`}
            >
              🐤
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-on-surface">Pengeluaran</span>
                {selectedType === 'Pengeluaran' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-bold">
                    Dipilih ✓
                  </span>
                )}
              </div>
              <span className="text-xs text-outline font-medium mt-0.5">
                Catat belanja, makan, kos & jajan harian
              </span>
            </div>
          </button>

          {/* Opsi 2: Pemasukan */}
          <button
            type="button"
            onClick={() => handleSelectType('Pemasukan')}
            className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 cursor-pointer group ${
              selectedType === 'Pemasukan'
                ? 'bg-primary-fixed/40 border-primary ring-2 ring-primary/30 shadow-xs'
                : 'bg-surface-container-low border-surface-container-highest hover:border-primary/60 hover:bg-surface-container'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                selectedType === 'Pemasukan'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest'
              }`}
            >
              🐣
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-on-surface">Pemasukan</span>
                {selectedType === 'Pemasukan' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold">
                    Dipilih ✓
                  </span>
                )}
              </div>
              <span className="text-xs text-outline font-medium mt-0.5">
                Catat gaji, bonus & pemasukan uang
              </span>
            </div>
          </button>
        </div>

        {/* Formulir Input Data: MUNCUL SETELAH MEMILIH JENIS TRANSAKSI (Judul header formulir dihapus) */}
        {selectedType ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4.5 pt-4 border-t border-surface-container animate-in fade-in slide-in-from-top-3 duration-300"
          >
            {/* Row 1: Tanggal & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <MiniCalendarPicker
                label="Tanggal Transaksi"
                value={date}
                onChange={setDate}
                placeholder="Pilih tanggal di kalender"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-outline flex items-center gap-1">
                  <span>🏷️</span>
                  <span>Kategori {selectedType}</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest cursor-pointer"
                >
                  {selectedType === 'Pemasukan' ? (
                    <>
                      <option value="Gaji">Gaji Bulanan Bebek</option>
                      <option value="Lainnya">Bonus & Pemasukan Lain</option>
                    </>
                  ) : (
                    <>
                      <option value="Makan">Makan & Minum Bebek</option>
                      <option value="Kos">Kos Bulanan</option>
                      <option value="Listrik">Listrik & Token PLN</option>
                      <option value="Kebutuhan Pokok">Kebutuhan Pokok (Sabun, Air Mineral, Pasta Gigi, dll)</option>
                      <option value="Transportasi">Transportasi Bebek</option>
                      <option value="Laundry">Laundry Kiloan</option>
                      <option value="Internet">Internet & Pulsa</option>
                      <option value="Skincare">Skincare & Perawatan</option>
                      <option value="Hiburan">Jajan & Hiburan</option>
                      <option value="Lainnya">Pengeluaran Lainnya</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Row 2: Keterangan Transaksi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-outline flex items-center gap-1">
                <span>📝</span>
                <span>Keterangan Transaksi</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  selectedType === 'Pengeluaran'
                    ? 'Contoh: Makan siang bebek, bayar laundry, kuota data...'
                    : 'Contoh: Gaji pokok bulanan, bonus lembur, cashback...'
                }
                required
                className="h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest"
              />
            </div>

            {/* Row 3: Nominal (Rp) with shortcut chips */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-outline flex items-center gap-1">
                <span>💵</span>
                <span>Nominal (Rp)</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-outline select-none">
                  Rp
                </span>
                <input
                  type="text"
                  value={rawAmount}
                  onChange={handleAmountChange}
                  placeholder="50.000"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface text-base font-extrabold focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest text-primary"
                />
              </div>

              {inputError && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
                  <span>⚠️</span>
                  <span>{inputError}</span>
                </p>
              )}

              {/* Quick amount shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-outline font-semibold">Tambah cepat:</span>
                {[10000, 20000, 50000, 100000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAddAmount(val)}
                    className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-bold transition-all cursor-pointer border border-surface-container-highest active:scale-95"
                  >
                    +{formatIDR(val).replace('Rp ', '')}
                  </button>
                ))}
                {rawAmount && (
                  <button
                    type="button"
                    onClick={() => setRawAmount('')}
                    className="px-2 py-1 rounded-full text-outline hover:text-error text-[11px] font-bold cursor-pointer ml-auto"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Row 4: Bank / Dompet Transaksi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-outline flex items-center gap-1">
                <span>🏦</span>
                <span>Bank / Dompet Transaksi</span>
              </label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest cursor-pointer"
              >
                <option value="BCA (Utama)">BCA (Utama)</option>
                <option value="BNI (Terima Gaji)">BNI (Terima Gaji)</option>
                <option value="Sea Bank">Sea Bank</option>
                <option value="Shopee Pay">Shopee Pay</option>
              </select>
            </div>


            {/* Submit Button */}
            <div className="pt-3 border-t border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-outline font-semibold flex items-center gap-1">
                <span>🐥</span>
                <span>Transaksi otomatis tersambung ke Catatan & Insights!</span>
              </div>

              {/* Tombol Simpan:
                  - Pengeluaran: "Simpan Jajan Bebek"
                  - Pemasukan: "Simpan Uang Bebek"
              */}
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-8 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-[0_2px_0_#1b3221]"
              >
                {selectedType === 'Pengeluaran' ? (
                  <>
                    <span className="text-base">🐤</span>
                    <span>Simpan Jajan Bebek</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">🐣</span>
                    <span>Simpan Uang Bebek</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 rounded-2xl bg-surface-container-low/60 border border-dashed border-surface-container-highest flex flex-col items-center justify-center text-center gap-2 text-outline">
            <span className="text-3xl">🐥</span>
            <span className="text-xs font-bold text-on-surface">
              Pilih salah satu jenis transaksi di atas
            </span>
            <span className="text-[11px] text-outline font-medium">
              Klik <strong>Pengeluaran</strong> atau <strong>Pemasukan</strong> untuk membuka formulir input data transaksi.
            </span>
          </div>
        )}
      </div>

      {/* Gentle Tips */}
      <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-highest flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">🐾</span>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
          Semua transaksi yang kamu simpan di sini akan otomatis terhubung ke perhitungan{' '}
          <strong>Sisa Saldo</strong> di <em>Insights Si Bebek</em> dan tercatat rapi di{' '}
          <em>Catatan Si Bebek</em>.
        </p>
      </div>
    </div>
  );
};
