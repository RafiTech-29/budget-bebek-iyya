import React from 'react';
import { PriorityBill } from '../types';
import { formatIDR } from '../data/initialData';

interface PriorityBillsProps {
  bills: PriorityBill[];
  onToggleStatus: (id: string) => void;
  onMarkAllPaid: () => void;
  onViewAll?: () => void;
}

export const PriorityBills: React.FC<PriorityBillsProps> = ({
  bills,
  onToggleStatus,
  onMarkAllPaid,
  onViewAll,
}) => {
  const renderStatusBadge = (status: PriorityBill['status']) => {
    if (status === 'Lunas') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center gap-1 shadow-2xs">
          <span>✓</span> Lunas
        </span>
      );
    } else if (status === 'Belum Bayar') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-error-container text-error text-xs font-bold shadow-2xs">
          Belum Bayar
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary text-xs font-bold shadow-2xs">
          Sebagian (75%)
        </span>
      );
    }
  };

  const getDuckBillIcon = (title: string) => {
    if (title.includes('Kos')) return '🏡';
    if (title.includes('Listrik')) return '⚡';
    if (title.includes('Internet')) return '📶';
    if (title.includes('Transport')) return '🛵';
    if (title.includes('Makan')) return '🥐';
    return '🐥';
  };

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-container-highest flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1 border-b border-surface-container">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs text-base">
            🐣
          </div>
          <h2 className="text-base font-bold text-on-surface">Kebutuhan Prioritas</h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-primary hover:underline font-bold cursor-pointer"
          >
            Lihat Catatan
          </button>
        )}
      </div>

      <p className="text-xs text-outline -mt-1 font-semibold">
        Pos pengeluaran utama yang wajib dipantau Si Bebek
      </p>

      {/* Priority Rows */}
      <div className="flex flex-col gap-2">
        {bills.map((bill) => (
          <div
            key={bill.id}
            onClick={() => onToggleStatus(bill.id)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer group border border-surface-container-highest"
            title="Klik untuk ubah status pembayaran"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-surface-container-lowest flex items-center justify-center text-sm shadow-2xs">
                {getDuckBillIcon(bill.title)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">{bill.title}</span>
                <span className="text-[11px] font-semibold text-outline">
                  {formatIDR(bill.amount)}
                </span>
              </div>
            </div>
            {renderStatusBadge(bill.status)}
          </div>
        ))}
      </div>

      <button
        onClick={onMarkAllPaid}
        className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.99]"
        type="button"
      >
        <span>🐣</span>
        <span>Centang Semua Tagihan Lunas</span>
      </button>
    </section>
  );
};
