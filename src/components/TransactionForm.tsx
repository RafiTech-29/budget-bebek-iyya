import React, { useState } from 'react';
import {
  CategoryType,
  PriorityType,
  Transaction,
} from '../types';
import { parseIDRInput, formatIDR, formatRibuan } from '../data/initialData';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
  onSuccess?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
  onSuccess,
}) => {
  const [date, setDate] = useState('25/10/2026');
  const [category, setCategory] = useState<CategoryType>('Makan');
  const [description, setDescription] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [bank, setBank] = useState('BCA (Utama)');
  const [priority, setPriority] = useState<PriorityType>('Wajib');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawAmount(formatRibuan(e.target.value));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseIDRInput(rawAmount);
    if (amount <= 0) {
      setErrorMsg('Silakan masukkan nominal transaksi yang valid.');
      return;
    }
    setErrorMsg(null);

    // Determine type automatically based on category
    let inferredType: Transaction['type'] = 'Pengeluaran';
    if (category === 'Gaji') inferredType = 'Pemasukan';
    else if (category === 'Tabungan') inferredType = 'Tabungan';

    onAddTransaction({
      date: date || '25/10/2026',
      category,
      description: description.trim() || category,
      amount,
      bank,
      priority,
      type: inferredType,
      loggedToJournal: true,
    });

    setDescription('');
    setRawAmount('');
    setErrorMsg(null);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (onSuccess) onSuccess();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {errorMsg && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* 1. Tanggal */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-outline">Tanggal</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="DD/MM/YYYY"
            required
            className="h-9 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest font-semibold"
          />
        </div>

        {/* 2. Kategori */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-outline">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="h-9 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest font-semibold cursor-pointer"
          >
            <option value="Makan">Makan & Minum</option>
            <option value="Kos">Kos Bulanan</option>
            <option value="Gaji">Gaji / Pemasukan</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Skincare">Skincare & Perawatan</option>
            <option value="Laundry">Laundry</option>
            <option value="Internet">Internet & Pulsa</option>
            <option value="Tabungan">Celengan / Tabungan</option>
            <option value="Hiburan">Hiburan & Keinginan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* 3. Keterangan */}
        <div className="flex flex-col gap-1 sm:col-span-2 md:col-span-1">
          <label className="text-[11px] font-bold text-outline">Keterangan</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Kopi susu Si Bebek"
            required
            className="h-9 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest font-semibold"
          />
        </div>

        {/* 4. Nominal */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-outline">Nominal (Rp)</label>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs font-bold text-outline select-none">
              Rp
            </span>
            <input
              type="text"
              value={rawAmount}
              onChange={handleAmountChange}
              placeholder="50.000"
              required
              className="w-full h-9 pl-8 pr-2.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest text-primary"
            />
          </div>
        </div>

        {/* 5. Bank Transaksi */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-outline">Bank Transaksi</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="h-9 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest font-semibold cursor-pointer"
          >
            <option value="BCA (Utama)">BCA (Utama)</option>
            <option value="BNI (Terima Gaji)">BNI (Terima Gaji)</option>
            <option value="Sea Bank">Sea Bank</option>
            <option value="Shopee Pay">Shopee Pay</option>
          </select>
        </div>

        {/* 6. Prioritas */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-outline">Prioritas</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityType)}
            className="h-9 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest font-semibold cursor-pointer"
          >
            <option value="Wajib">Wajib (Kebutuhan Pokok)</option>
            <option value="Penting">Penting (Penunjang)</option>
            <option value="Opsional">Opsional (Keinginan)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className={`h-9 px-5 rounded-full font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:translate-y-0.5 cursor-pointer ${
            isSaved
              ? 'bg-primary-fixed text-primary font-bold'
              : 'bg-primary hover:bg-primary-container text-on-primary shadow-[0_2px_0_#1b3221]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">
            {isSaved ? 'check_circle' : 'add_circle'}
          </span>
          <span>{isSaved ? 'Berhasil Dicatat!' : '+ Simpan Transaksi'}</span>
        </button>
      </div>
    </form>
  );
};
