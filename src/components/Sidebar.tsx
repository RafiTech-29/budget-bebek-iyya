import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const SI_BEBEK_TIPS = [
  'Pengeluaran jajan minggu ini masih aman di bawah jatah! Jangan lupa nabung koin ya ✨',
  'Membeli barang karena butuh, bukan karena lapar mata ya, Si Bebek! 🐥',
  'Sisihkan uang di awal gajian, jangan tunggu sisa di akhir bulan 💡',
  'Catat setiap rupiah dengan riang, finansial tenang hidup pun lapang! 🌿',
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [tipIdx, setTipIdx] = useState(0);

  // Urutan Menu Si Bebek di Navbar Kiri:
  // 1. Insight Si Bebek (Laporan keseluruhan)
  // 2. Jatah Si Bebek (Limit & alokasi belanja per kategori)
  // 3. Catatan Si Bebek (Catatan pengeluaran, pemasukan & tabungan - ada tombol pop-up Input Jajan Bebek)
  // 4. Tabungan Si Bebek (Informasi tabungan impian Si Bebek)
  const navItems: { id: ActiveTab; label: string; duckEmoji: string; desc: string }[] = [
    {
      id: 'insights',
      label: 'Insight Si Bebek',
      duckEmoji: '🐥',
      desc: 'Laporan keseluruhan',
    },
    {
      id: 'alokasi',
      label: 'Jatah Si Bebek',
      duckEmoji: '🐣',
      desc: 'Alokasi jatah belanja',
    },
    {
      id: 'catatan',
      label: 'Catatan Si Bebek',
      duckEmoji: '🐤',
      desc: 'Pengeluaran & pemasukan',
    },
    {
      id: 'tabungan',
      label: 'Tabungan Si Bebek',
      duckEmoji: '🪙',
      desc: 'Informasi tabungan',
    },
  ];

  const handleNextTip = () => {
    setTipIdx((prev) => (prev + 1) % SI_BEBEK_TIPS.length);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-20 bottom-0 w-64 bg-surface-container-low/90 border-r border-surface-container-highest flex-col justify-between p-3.5 z-30 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {/* Header Label */}
        <div className="px-3 pt-1 flex items-center justify-between">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Menu Si Bebek
          </span>
          <span className="text-sm">🐾</span>
        </div>

        {/* Main Menus in exact requested order: Insight -> Jatah -> Input Jajan -> Catatan -> Tabungan */}
        <nav className="flex flex-col gap-1.5 pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm shadow-[0_2px_0_#1b3221]'
                    : 'text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 flex-shrink-0 ${
                    isActive
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-lowest shadow-2xs'
                  }`}
                >
                  {item.duckEmoji}
                </span>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold truncate">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-semibold truncate ${
                      isActive ? 'text-on-primary-container' : 'text-outline'
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pojok Si Bebek Widget */}
      <div
        onClick={handleNextTip}
        className="p-3.5 bg-surface-container-lowest border border-surface-container-highest rounded-2xl flex flex-col gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer transition-all hover:border-secondary"
        title="Klik untuk tips Si Bebek lainnya!"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-secondary">
            <div className="w-7 h-7 rounded-lg bg-primary-fixed/30 border border-secondary/30 flex items-center justify-center text-base">
              🐥
            </div>
            <span className="text-xs font-bold">Pojok Si Bebek</span>
          </div>
          <span className="text-[10px] text-outline font-semibold">Ganti tip ↺</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
          {SI_BEBEK_TIPS[tipIdx]}
        </p>
      </div>
    </aside>
  );
};
