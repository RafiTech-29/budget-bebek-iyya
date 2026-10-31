import React, { useState, useEffect } from 'react';
import { SavingsGoal, Transaction, CategoryType, PriorityType } from '../types';
import { parseIDRInput, formatIDR, formatRibuan } from '../data/initialData';
import { MiniCalendarPicker } from './MiniCalendarPicker';

/* 1. Modal Tambah Celengan Impian */
interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<SavingsGoal, 'id'>) => void;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const YEARS = ['2026', '2027', '2028', '2029', '2030', '2031', '2032'];

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Desember');
  const [selectedYear, setSelectedYear] = useState('2027');
  const [selectedIcon, setSelectedIcon] = useState('🐥');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseIDRInput(targetStr);
    if (!title.trim() || target <= 0) {
      setErrorMsg('Mohon isi nama impian dan nominal target yang valid.');
      return;
    }
    setErrorMsg(null);

    onSave({
      title: title.trim(),
      target,
      current: 0,
      deadline: `${selectedMonth} ${selectedYear}`,
      icon: selectedIcon,
      color: '#2d4833',
    });

    setTitle('');
    setTargetStr('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 transition-opacity">
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-xl border border-surface-container-highest flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐣</span>
            <h3 className="text-base font-bold text-on-surface">Tambah Tabungan Impian Bebek</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-outline">Nama Impian Bebek</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kursus Desain Si Bebek, Dana Liburan..."
              required
              className="h-9 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs focus:ring-2 focus:ring-primary border border-surface-container-highest font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-outline">Target Nominal (Rp)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-outline select-none">
                Rp
              </span>
              <input
                type="text"
                value={targetStr}
                onChange={(e) => setTargetStr(formatRibuan(e.target.value))}
                placeholder="2.000.000"
                required
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold focus:ring-2 focus:ring-primary border border-surface-container-highest text-primary"
              />
            </div>
            {/* Quick choices */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-outline font-semibold">Pilihan cepat:</span>
              {[500000, 1000000, 2500000, 5000000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTargetStr(formatRibuan(v))}
                  className="px-2 py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-[10px] font-bold border border-surface-container-highest cursor-pointer active:scale-95"
                >
                  +{formatRibuan(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Target Waktu: Pilihan Kalender / Bulan & Tahun Otomatis */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-outline flex items-center gap-1">
              <span>🗓️</span>
              <span>Target Waktu (Bulan & Tahun)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-9 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs focus:ring-2 focus:ring-primary border border-surface-container-highest font-bold cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-9 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs focus:ring-2 focus:ring-primary border border-surface-container-highest font-bold cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-outline font-semibold">
              Tercapai pada: <strong className="text-primary">{selectedMonth} {selectedYear}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-outline">Pilih Simbol Bebek</label>
            <div className="flex items-center gap-2 pt-1">
              {['🐥', '🐣', '🐤', '🪙', '🏡', '🛵'].map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setSelectedIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    selectedIcon === ic
                      ? 'bg-primary text-on-primary ring-2 ring-primary ring-offset-2'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shadow-[0_2px_0_#1b3221]"
            >
              Simpan Impian
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 2. Modal Panduan Bebek */
interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-surface-container-lowest rounded-2xl p-5 w-full max-w-md shadow-xl border border-surface-container-highest flex flex-col gap-3.5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐥</span>
            <h3 className="text-base font-bold text-on-surface">Panduan Jurnal Si Bebek</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="text-xs text-on-surface-variant space-y-2.5 leading-relaxed font-medium">
          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-highest flex items-start gap-2.5">
            <span className="text-lg mt-0.5">🐥</span>
            <div>
              <strong className="text-on-surface">1. Insights Si Bebek:</strong> Pusat informasi laporan keseluruhan. Menampilkan sisa saldo (Sisa budget bulan lalu + pemasukan aktual − pengeluaran aktual), total pengeluaran, pemasukan, dan performa anggaran.
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-highest flex items-start gap-2.5">
            <span className="text-lg mt-0.5">🐤</span>
            <div>
              <strong className="text-on-surface">2. Catatan Si Bebek:</strong> Daftar seluruh riwayat mutasi pengeluaran dan pemasukan, dapat dicari, difilter per bank, diubah, maupun diekspor ke CSV.
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-highest flex items-start gap-2.5">
            <span className="text-lg mt-0.5">🐣</span>
            <div>
              <strong className="text-on-surface">3. Celengan Si Bebek:</strong> Tempat melacak tabungan impian, progres dana darurat, dan koin jajan harian.
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-highest flex items-start gap-2.5">
            <span className="text-lg mt-0.5">🐥</span>
            <div>
              <strong className="text-on-surface">4. Input Jajan Bebek:</strong> Satu-satunya tempat resmi untuk menginput segala transaksi baru, baik pengeluaran, pemasukan, maupun celengan.
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-surface-container">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container cursor-pointer shadow-[0_2px_0_#1b3221]"
          >
            Saya Mengerti! ✨
          </button>
        </div>
      </div>
    </div>
  );
};

/* 3. Modal Edit Transaksi */
interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onUpdate: (updated: Transaction) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onUpdate,
}) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<CategoryType>('Makan');
  const [description, setDescription] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [bank, setBank] = useState('BCA (Utama)');
  const [priority, setPriority] = useState<PriorityType>('Wajib');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setDate(transaction.date);
      setCategory(transaction.category as CategoryType);
      setDescription(transaction.description);
      setBank(transaction.bank || 'BCA (Utama)');
      setPriority(transaction.priority || 'Wajib');
      setRawAmount(formatRibuan(transaction.amount));
      setErrorMsg(null);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseIDRInput(rawAmount);
    if (amount <= 0) {
      setErrorMsg('Masukkan nominal yang valid.');
      return;
    }
    setErrorMsg(null);

    onUpdate({
      ...transaction,
      date,
      category,
      description,
      bank,
      priority,
      amount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 transition-opacity">
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-xl border border-surface-container-highest flex flex-col gap-3.5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✏️</span>
            <h3 className="text-base font-bold text-on-surface">Ubah Catatan Si Bebek</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <MiniCalendarPicker
            label="Tanggal Transaksi"
            value={date}
            onChange={setDate}
            placeholder="Pilih tanggal di kalender"
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="h-9 px-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-highest font-semibold cursor-pointer"
              >
                <option value="Makan">Makan</option>
                <option value="Kos">Kos</option>
                <option value="Listrik">Listrik</option>
                <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                <option value="Gaji">Gaji</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Skincare">Skincare</option>
                <option value="Laundry">Laundry</option>
                <option value="Internet">Internet</option>
                <option value="Tabungan">Tabungan</option>
                <option value="Hiburan">Hiburan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-outline">Bank Transaksi</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="h-9 px-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-highest font-semibold cursor-pointer"
              >
                <option value="BCA (Utama)">BCA (Utama)</option>
                <option value="BNI (Terima Gaji)">BNI (Terima Gaji)</option>
                <option value="Sea Bank">Sea Bank</option>
                <option value="Shopee Pay">Shopee Pay</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-outline">Keterangan</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-highest font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-outline">Nominal (Rp)</label>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs font-bold text-outline select-none">
                Rp
              </span>
              <input
                type="text"
                value={rawAmount}
                onChange={(e) => setRawAmount(formatRibuan(e.target.value))}
                placeholder="50.000"
                className="w-full h-9 pl-8 pr-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-surface-container-highest text-primary focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container cursor-pointer shadow-[0_2px_0_#1b3221]"
            >
              Perbarui Catatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
