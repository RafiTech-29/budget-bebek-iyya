import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { formatIDR } from '../data/initialData';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onOpenNewTransaction?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  onOpenNewTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBank, setSelectedBank] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Category badge mapping
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Gaji':
        return { bg: 'bg-primary-fixed', text: 'text-primary', icon: 'payments' };
      case 'Kos':
        return { bg: 'bg-secondary-container', text: 'text-secondary', icon: 'home' };
      case 'Makan':
        return { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed-variant', icon: 'restaurant' };
      case 'Transportasi':
        return { bg: 'bg-surface-variant', text: 'text-on-surface-variant', icon: 'directions_bike' };
      case 'Skincare':
        return { bg: 'bg-error-container', text: 'text-error', icon: 'face' };
      case 'Laundry':
        return { bg: 'bg-surface-container-high', text: 'text-outline', icon: 'local_laundry_service' };
      case 'Internet':
        return { bg: 'bg-tertiary-fixed', text: 'text-tertiary', icon: 'wifi' };
      case 'Tabungan':
        return { bg: 'bg-primary-fixed-dim', text: 'text-primary', icon: 'savings' };
      default:
        return { bg: 'bg-surface-container', text: 'text-on-surface', icon: 'label' };
    }
  };

  const filteredList = useMemo(() => {
    let list = [...transactions];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.bank && t.bank.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (selectedBank !== 'all') {
      list = list.filter((t) => t.bank === selectedBank);
    }

    if (selectedMonth === 'okt') {
      list = list.filter((t) => t.date.includes('/10/') || t.date.includes('Okt'));
    } else if (selectedMonth === 'sep') {
      list = list.filter((t) => t.date.includes('/09/') || t.date.includes('Sep'));
    }

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
  }, [transactions, searchTerm, selectedCategory, selectedBank, selectedMonth, sortBy]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-4 lg:p-5 shadow-sm border border-surface-container-highest flex flex-col gap-3.5">
      {/* Header and Live Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2 border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Riwayat Transaksi Si Bebek</h2>
            <p className="text-xs text-outline font-semibold">
              Pencatatan rincian pemasukan, pengeluaran & bank transaksi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewTransaction && (
            <button
              onClick={onOpenNewTransaction}
              className="px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Input Baru</span>
            </button>
          )}

          {/* Live Search Bar */}
          <div className="relative w-full md:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari transaksi / bank..."
              className="w-full h-8 pl-8 pr-3 rounded-full bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest/60 font-semibold"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-outline hover:text-on-surface text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 justify-between bg-surface-container-low p-2.5 rounded-xl border border-surface-container-highest">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Bulan */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-7 px-2 text-xs font-bold rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest shadow-2xs focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">Oktober 2026 (Aktif)</option>
            <option value="sep">September 2026</option>
            <option value="agu">Agustus 2026</option>
          </select>

          {/* Filter Kategori */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-7 px-2 text-xs font-bold rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest shadow-2xs focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="Gaji">Gaji</option>
            <option value="Kos">Kos</option>
            <option value="Makan">Makan</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Skincare">Skincare</option>
            <option value="Laundry">Laundry</option>
            <option value="Internet">Internet</option>
            <option value="Tabungan">Tabungan</option>
            <option value="Hiburan">Hiburan</option>
          </select>

          {/* Filter Bank Transaksi */}
          <select
            value={selectedBank}
            onChange={(e) => {
              setSelectedBank(e.target.value);
              setCurrentPage(1);
            }}
            className="h-7 px-2 text-xs font-bold rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest shadow-2xs focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">Semua Bank</option>
            <option value="BCA (Utama)">BCA (Utama)</option>
            <option value="BNI (Terima Gaji)">BNI (Terima Gaji)</option>
            <option value="Sea Bank">Sea Bank</option>
            <option value="Shopee Pay">Shopee Pay</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-1.5">
          <span className="text-outline text-xs font-bold">Urutan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-7 px-2 text-xs font-bold rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest shadow-2xs focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highest">Nominal Terbesar</option>
            <option value="lowest">Nominal Terkecil</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-surface-container-highest">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3 rounded-l-lg">Tanggal</th>
              <th className="py-2.5 px-3">Kategori</th>
              <th className="py-2.5 px-3">Keterangan</th>
              <th className="py-2.5 px-3">Bank Transaksi</th>
              <th className="py-2.5 px-3">Prioritas</th>
              <th className="py-2.5 px-3 text-right">Nominal</th>
              <th className="py-2.5 px-3 text-right">Saldo Berjalan</th>
              <th className="py-2.5 px-3 text-center rounded-r-lg">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-surface-container-high font-semibold">
            {paginatedList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-outline text-xs font-semibold">
                  Belum ada transaksi Si Bebek yang sesuai kriteria.
                </td>
              </tr>
            ) : (
              paginatedList.map((t, idx) => {
                const isEven = idx % 2 === 0;
                const catBadge = getCategoryBadge(t.category);
                const isPlus = t.category === 'Gaji' || t.type === 'Pemasukan';
                const amountPrefix = isPlus ? '+ ' : '- ';
                const amountColor = isPlus ? 'text-primary font-bold' : 'text-on-surface';

                return (
                  <tr
                    key={t.id}
                    className={`${
                      isEven ? 'bg-surface-container-lowest' : 'bg-surface-container-low/50'
                    } hover:bg-surface-container transition-colors`}
                  >
                    <td className="py-2.5 px-3 text-on-surface-variant font-medium">{t.date}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-6 h-6 rounded-full ${catBadge.bg} ${catBadge.text} flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {catBadge.icon}
                          </span>
                        </div>
                        <span className="font-bold text-on-surface">{t.category}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-on-surface font-medium">{t.description}</td>
                    <td className="py-2.5 px-3 text-on-surface-variant font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-bold">
                        {t.bank || 'BCA (Utama)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === 'Wajib'
                            ? 'bg-primary-fixed text-primary'
                            : t.priority === 'Penting'
                            ? 'bg-tertiary-fixed text-tertiary'
                            : 'bg-surface-variant text-on-surface-variant'
                        }`}
                      >
                        {t.priority || 'Wajib'}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 text-right ${amountColor}`}>
                      {amountPrefix}
                      {formatIDR(t.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-on-surface-variant font-medium">
                      {formatIDR(t.balance || 0)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditTransaction(t)}
                          className="w-7 h-7 rounded-md hover:bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer"
                          title="Ubah Transaksi"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(t.id)}
                          className="w-7 h-7 rounded-md hover:bg-error-container/50 flex items-center justify-center text-outline hover:text-error transition-colors cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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

      {/* Footer and Pagination */}
      <div className="flex items-center justify-between pt-1 text-outline text-xs font-semibold">
        <span>
          Menampilkan {filteredList.length} catatan transaksi Si Bebek (Oktober 2026)
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container text-on-surface-variant disabled:opacity-30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-bold">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container text-on-surface-variant disabled:opacity-30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};
