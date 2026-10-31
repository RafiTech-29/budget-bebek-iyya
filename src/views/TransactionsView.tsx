import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { formatIDR } from '../data/initialData';
import { InputJajanView } from './InputJajanView';

interface TransactionsViewProps {
  transactions: Transaction[];
  previousMonthBudgetRemaining?: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  onDeleteTransaction: (id: number) => void;
  onEditTransaction: (t: Transaction) => void;
  onNavigateToInput: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  previousMonthBudgetRemaining = 0,
  totalIncome,
  totalExpense,
  totalSavings,
  onDeleteTransaction,
  onEditTransaction,
  onNavigateToInput,
  onAddTransaction,
}) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Filter jenis transaksi: 'all' | 'Pemasukan' | 'Pengeluaran' | 'Tabungan'
  const [typeFilter, setTypeFilter] = useState<'all' | 'Pemasukan' | 'Pengeluaran' | 'Tabungan'>('all');
  const [selectedBank, setSelectedBank] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Sisa Saldo Realtime = Sisa budget bulan sebelumnya + Total Pemasukan - Total Pengeluaran - Total Tabungan
  const sisaSaldoRealtime = previousMonthBudgetRemaining + totalIncome - totalExpense - totalSavings;

  // Category Duck Emoji Mapping
  const getDuckEmoji = (cat: string) => {
    switch (cat) {
      case 'Gaji':
        return '🐣';
      case 'Kos':
        return '🏡';
      case 'Listrik':
        return '⚡';
      case 'Kebutuhan Pokok':
        return '🧼';
      case 'Makan':
        return '🥐';
      case 'Transportasi':
        return '🛵';
      case 'Skincare':
        return '🧴';
      case 'Laundry':
        return '🧺';
      case 'Internet':
        return '📶';
      case 'Tabungan':
        return '🪙';
      case 'Hiburan':
        return '🎮';
      default:
        return '🐥';
    }
  };

  // Helper untuk menentukan tipe transaksi
  const getTransactionType = (t: Transaction): 'Pemasukan' | 'Pengeluaran' | 'Tabungan' => {
    if (t.type === 'Pemasukan' || t.category === 'Gaji') return 'Pemasukan';
    if (t.type === 'Tabungan' || t.type === 'Transfer' || t.category === 'Tabungan') return 'Tabungan';
    return 'Pengeluaran';
  };

  const countPemasukan = transactions.filter((t) => getTransactionType(t) === 'Pemasukan').length;
  const countPengeluaran = transactions.filter((t) => getTransactionType(t) === 'Pengeluaran').length;
  const countTabungan = transactions.filter((t) => getTransactionType(t) === 'Tabungan').length;

  const exportCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Jenis',
      'Kategori',
      'Keterangan',
      'Bank Transaksi',
      'Nominal',
    ];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      getTransactionType(t),
      t.category,
      `"${t.description}"`,
      `"${t.bank || 'BCA (Utama)'}"`,
      t.amount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `catatan-si-bebek-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = useMemo(() => {
    let list = [...transactions];

    // Filter Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.bank && t.bank.toLowerCase().includes(q))
      );
    }

    // Filter Type: Pemasukan / Pengeluaran / Tabungan
    if (typeFilter !== 'all') {
      list = list.filter((t) => getTransactionType(t) === typeFilter);
    }

    // Filter Bank
    if (selectedBank !== 'all') {
      list = list.filter((t) => (t.bank || 'BCA (Utama)') === selectedBank);
    }

    // Sort
    if (sortBy === 'newest') {
      list.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.amount - b.amount);
    }

    return list;
  }, [transactions, searchTerm, typeFilter, selectedBank, sortBy]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. SISA SALDO REALTIME DITAMPILKAN DALAM BENTUK LEBIH BESAR (POINT UTAMA) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-sm border border-surface-container-highest flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-3xl shadow-xs">
            🐤
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
            {/* Sisa Saldo Besar */}
            <div className="text-3xl lg:text-4xl font-black text-primary tracking-tight font-nunito">
              {formatIDR(sisaSaldoRealtime)}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs text-outline font-semibold">Status Finansial</span>
          <span className="text-sm font-bold text-on-surface flex items-center gap-1 mt-0.5">
            <span>{sisaSaldoRealtime >= 0 ? 'Terkendali & Aman' : 'Perlu Penghematan'}</span>
            <span>✨</span>
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
              {countPemasukan} kali pencatatan
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
              {countPengeluaran} kali jajan
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
              {countTabungan} kali setoran
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-xl shadow-2xs">
            🪙
          </div>
        </div>
      </div>

      {/* Header Banner & Tombol Input */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary-container flex items-center justify-center text-xl shadow-xs">
            🐤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-on-surface">Catatan Si Bebek</h1>
              <span className="text-sm">🐾</span>
            </div>
            <p className="text-xs text-outline font-semibold">
              Semua catatan transaksi bisa diedit atau dihapus jika ada perubahan atau salah input data ✏️🗑️
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-surface-container-highest cursor-pointer active:scale-95"
          >
            <span>🐤</span>
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setIsInputModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shadow-[0_2px_0_#1b3221]"
          >
            <span>🐥</span>
            <span>Input Jajan Bebek</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-2xs flex flex-col gap-3">
        {/* Baris 1: Filter Jenis Transaksi */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-outline mr-1 flex items-center gap-1">
            <span>🔎</span>
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-on-surface text-surface shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            Semua ({transactions.length})
          </button>

          <button
            onClick={() => setTypeFilter('Pemasukan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              typeFilter === 'Pemasukan'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-primary'
            }`}
          >
            <span>🐣</span>
            <span>Pemasukan ({countPemasukan})</span>
          </button>

          <button
            onClick={() => setTypeFilter('Pengeluaran')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              typeFilter === 'Pengeluaran'
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-secondary'
            }`}
          >
            <span>💸</span>
            <span>Pengeluaran ({countPengeluaran})</span>
          </button>

          <button
            onClick={() => setTypeFilter('Tabungan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              typeFilter === 'Tabungan'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span>🪙</span>
            <span>Tabungan ({countTabungan})</span>
          </button>
        </div>

        {/* Baris 2: Pencarian Kata Kunci & Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-surface-container">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Cari transaksi, keterangan, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-outline border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-outline">🔍</span>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
            >
              <option value="all">Semua Bank / Dompet</option>
              <option value="BCA (Utama)">BCA (Utama)</option>
              <option value="BNI (Terima Gaji)">BNI (Terima Gaji)</option>
              <option value="Sea Bank">Sea Bank</option>
              <option value="Shopee Pay">Shopee Pay</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-9 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highest">Nominal Terbesar</option>
              <option value="lowest">Nominal Terkecil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Daftar Catatan Transaksi */}
      {/* 1. Tampilan Mobile (< md): Kartu Transaksi Responsif */}
      <div className="block md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest p-8 text-center text-outline">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">🐤</span>
              <span className="font-bold text-on-surface text-sm">
                Belum ada catatan transaksi yang cocok
              </span>
              <p className="text-xs max-w-xs text-outline">
                {transactions.length === 0
                  ? 'Catatan masih kosong. Klik tombol "Input Jajan Bebek" untuk mulai mencatat!'
                  : 'Coba ubah kata kunci pencarian atau filter yang kamu pilih.'}
              </p>
              {transactions.length === 0 && (
                <button
                  onClick={() => setIsInputModalOpen(true)}
                  className="mt-2 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shadow-[0_2px_0_#1b3221]"
                >
                  <span>🐥</span>
                  <span>Input Jajan Bebek</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          filtered.map((t) => {
            const txType = getTransactionType(t);
            const isPlus = txType === 'Pemasukan';
            const isSavings = txType === 'Tabungan';

            return (
              <div
                key={t.id}
                className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-highest shadow-2xs flex flex-col gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getDuckEmoji(t.category)}</span>
                    <div>
                      <span className="font-extrabold text-sm text-on-surface block leading-tight">
                        {t.category}
                      </span>
                      <span className="text-[11px] font-semibold text-outline">
                        {t.date}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black font-nunito ${
                      isPlus
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : isSavings
                        ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant border border-tertiary/20'
                        : 'bg-secondary-container/50 text-secondary border border-secondary/20'
                    }`}
                  >
                    {isPlus ? '+ ' : isSavings ? '🪙 ' : '− '}
                    {formatIDR(t.amount)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-on-surface bg-surface-container-low/60 p-2.5 rounded-xl border border-surface-container-highest break-words">
                  {t.description}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-surface-container">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-bold text-on-surface-variant border border-surface-container-highest">
                    🏦 {t.bank || 'BCA (Utama)'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditTransaction(t)}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary-container text-on-surface hover:text-primary transition-all cursor-pointer text-xs font-bold flex items-center gap-1 border border-surface-container-highest active:scale-95"
                      title="Ubah catatan"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setTransactionToDelete(t)}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-surface-container hover:bg-rose-500/15 text-rose-700 hover:text-rose-800 dark:text-rose-400 transition-all cursor-pointer text-xs font-bold flex items-center gap-1 border border-surface-container-highest active:scale-95"
                      title="Hapus catatan"
                    >
                      <span>🗑️</span>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Tampilan Desktop (>= md): Tabel Catatan Transaksi */}
      <div className="hidden md:block bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-sm overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="border-b border-surface-container bg-surface-container-low text-outline font-bold">
              <th className="py-3.5 px-3 text-center">Tanggal</th>
              <th className="py-3.5 px-3 text-center">Kategori</th>
              <th className="py-3.5 px-4 text-center">Keterangan</th>
              <th className="py-3.5 px-3 text-center">Bank</th>
              <th className="py-3.5 px-3 text-center">Nominal</th>
              <th className="py-3.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-outline">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">🐤</span>
                    <span className="font-bold text-on-surface text-sm">
                      Belum ada catatan transaksi yang cocok
                    </span>
                    <p className="text-xs max-w-sm text-outline">
                      {transactions.length === 0
                        ? 'Catatan masih kosong. Klik tombol "Input Jajan Bebek" untuk mulai mencatat transaksi aktualmu!'
                        : 'Coba ubah kata kunci pencarian atau filter yang kamu pilih.'}
                    </p>
                    {transactions.length === 0 && (
                      <button
                        onClick={() => setIsInputModalOpen(true)}
                        className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shadow-[0_2px_0_#1b3221]"
                      >
                        <span>🐥</span>
                        <span>Input Jajan Bebek</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((t, idx) => {
                const isEven = idx % 2 === 0;
                const txType = getTransactionType(t);
                const isPlus = txType === 'Pemasukan';
                const isSavings = txType === 'Tabungan';

                return (
                  <tr
                    key={t.id}
                    className={`${
                      isEven ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'
                    } hover:bg-surface-container/70 transition-colors`}
                  >
                    {/* Tanggal - Center */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container/70 text-xs font-semibold text-on-surface-variant border border-surface-container-highest inline-block">
                        {t.date}
                      </span>
                    </td>

                    {/* Kategori - Center */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-highest shadow-2xs">
                        <span className="text-base">{getDuckEmoji(t.category)}</span>
                        <span className="font-extrabold text-xs text-on-surface">{t.category}</span>
                      </div>
                    </td>

                    {/* Keterangan - Center */}
                    <td className="py-3.5 px-4 text-center text-on-surface font-semibold max-w-xs break-words">
                      {t.description}
                    </td>

                    {/* Bank - Center */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-bold text-on-surface-variant border border-surface-container-highest">
                        🏦 {t.bank || 'BCA (Utama)'}
                      </span>
                    </td>

                    {/* Nominal - Center */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black font-nunito ${
                          isPlus
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : isSavings
                            ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant border border-tertiary/20'
                            : 'bg-secondary-container/50 text-secondary border border-secondary/20'
                        }`}
                      >
                        {isPlus ? '+ ' : isSavings ? '🪙 ' : '− '}
                        {formatIDR(t.amount)}
                      </span>
                    </td>

                    {/* Aksi - Center */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditTransaction(t)}
                          className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-primary-container text-on-surface hover:text-primary transition-all cursor-pointer text-xs font-bold flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 border border-surface-container-highest"
                          title="Ubah catatan transaksi ini"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setTransactionToDelete(t)}
                          className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-rose-500/15 text-rose-700 hover:text-rose-800 dark:text-rose-400 transition-all cursor-pointer text-xs font-bold flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 border border-surface-container-highest"
                          title="Hapus catatan transaksi ini"
                        >
                          <span>🗑️</span>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right text-xs text-outline font-semibold">
        Menampilkan {filtered.length} dari {transactions.length} catatan Si Bebek
      </div>

      {/* Pop-up Modal Input Jajan Bebek: Tampilan sama persis dan sesuai dengan yang sudah ada di menu Input Jajan Bebek */}
      {isInputModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsInputModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-surface-container-lowest shadow-2xl border border-surface-container-highest p-4 sm:p-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup Pop-up di sudut kanan atas */}
            <button
              onClick={() => setIsInputModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm transition-all cursor-pointer shadow-xs"
              title="Tutup Pop-up"
            >
              ✕
            </button>

            {/* Tampilan SAMA PERSIS dan SESUAI dengan yang ada di menu Input Jajan Bebek */}
            <InputJajanView
              onAddTransaction={(tx) => {
                onAddTransaction(tx);
                setIsInputModalOpen(false);
              }}
              onNavigateToCatatan={() => setIsInputModalOpen(false)}
              onClose={() => setIsInputModalOpen(false)}
              isModal={true}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalSavings={totalSavings}
              previousMonthBudgetRemaining={previousMonthBudgetRemaining}
            />
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Catatan Si Bebek */}
      {transactionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setTransactionToDelete(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-xl border border-surface-container-highest flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-on-surface">Hapus Catatan Bebek?</h3>
                <p className="text-xs text-outline font-medium">Data yang dihapus tidak dapat dipulihkan</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs space-y-1.5 text-center">
              <p className="text-outline font-semibold">Detail transaksi yang akan dihapus:</p>
              <p className="font-extrabold text-sm text-on-surface">{transactionToDelete.description}</p>
              <p className="text-primary font-black font-nunito text-base">
                {formatIDR(transactionToDelete.amount)}
              </p>
              <span className="text-[11px] text-outline block">
                {transactionToDelete.date} • {transactionToDelete.category} • {transactionToDelete.bank || 'BCA (Utama)'}
              </span>
            </div>

            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTransactionToDelete(null)}
                className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteTransaction(transactionToDelete.id);
                  setTransactionToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              >
                Ya, Hapus Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
