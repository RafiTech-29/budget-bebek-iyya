import React, { useState } from 'react';

interface HeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onOpenGuide: () => void;
  onResetData?: () => void;
}

const CHEER_QUOTES = [
  'Semangat hari ini, Si Bebek! ♡',
  'Satu rupiah pun sangat berarti! ✨',
  'Catat dengan gembira, Si Bebek! 🌸',
  'Pelan-pelan tapi pasti bertambah! 🐥',
];

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  onMonthChange,
  onOpenGuide,
  onResetData,
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const months = ['Desember 2026', 'November 2026', 'Oktober 2026', 'September 2026', 'Agustus 2026'];

  const handleNextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % CHEER_QUOTES.length);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-surface-container-low/95 backdrop-blur-md z-40 border-b border-surface-container-highest shadow-[0_2px_10px_rgba(75,73,61,0.03)]">
      <div className="h-16 sm:h-20 w-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={handleNextQuote}
            title="Klik Si Bebek untuk kata semangat!"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-fixed/40 border-2 border-primary/30 shadow-xs flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110 active:scale-95">
              <span>🐣</span>
            </div>
            <span className="absolute -bottom-1 -right-1 text-[10px] sm:text-[11px] bg-secondary-container text-secondary rounded-full px-1 font-bold shadow-2xs border border-surface-container-highest">
              ✨
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="font-extrabold text-base sm:text-2xl lg:text-3xl text-primary tracking-tight font-nunito leading-tight truncate">
              Budget Si Bebek
            </h1>
            <p className="text-[9px] sm:text-[11px] text-outline tracking-wider font-semibold truncate">
              Little steps, better finances ♡
            </p>
          </div>
        </div>

        {/* Action Controls & Mascot Cheer */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Month Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-surface-container-lowest border border-surface-container-highest rounded-full shadow-2xs hover:bg-surface-container transition-colors text-on-surface text-xs font-bold cursor-pointer"
              type="button"
            >
              <span>🗓️</span>
              <span className="hidden sm:inline">{currentMonth}</span>
              <span className="inline sm:hidden">{currentMonth.split(' ')[0]}</span>
              <span className="text-[10px] sm:text-xs text-outline font-bold">
                {showMonthDropdown ? '▲' : '▼'}
              </span>
            </button>

            {showMonthDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[10px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                  <span>🐾</span>
                  <span>Pilih Periode</span>
                </div>
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      onMonthChange(m);
                      setShowMonthDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      currentMonth === m
                        ? 'bg-primary-fixed text-primary font-bold'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span>{m}</span>
                    {currentMonth === m && <span>✓</span>}
                  </button>
                ))}
                <div className="mt-1 pt-1.5 border-t border-surface-container px-2 py-1 text-[10px] text-outline font-semibold leading-tight flex items-center gap-1">
                  <span>💡</span>
                  <span>Sisa saldo otomatis jadi pemasukan di bulan baru</span>
                </div>
              </div>
            )}
          </div>

          {/* Cheer Badge */}
          <button
            onClick={handleNextQuote}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-tertiary-fixed/30 border border-tertiary-fixed rounded-full hover:bg-tertiary-fixed/50 transition-all cursor-pointer"
            title="Klik untuk ganti pesan semangat"
          >
            <span>🌿</span>
            <span className="text-xs text-tertiary font-bold">{CHEER_QUOTES[quoteIdx]}</span>
            <span>🐥</span>
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-lg shadow-xs transition-transform hover:scale-105 cursor-pointer border border-primary/20"
              title="Profil Pengguna"
            >
              <span>🐥</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-xl p-3 z-50 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-2 border-b border-surface-container">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-xl shadow-2xs">
                    🐣
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-on-surface">Kawan Si Bebek</span>
                    <span className="text-[11px] text-outline truncate max-w-[150px]">
                      lovestoryofyafi@gmail.com
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenGuide();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  >
                    <span>🐥</span>
                    <span>Panduan Jurnal Si Bebek</span>
                  </button>
                  <div className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-outline flex items-center gap-2">
                    <span>💾</span>
                    <span>Penyimpanan: Aktif & Lokal</span>
                  </div>
                  {onResetData && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onResetData();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-error hover:bg-error-container/30 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🧹</span>
                      <span>Hapus Semua Data (Mulai dari Awal)</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-surface-container text-[11px] text-outline text-center flex items-center justify-center gap-1">
                  <span>🐾</span>
                  <span>Budget Si Bebek • 4 Menu Utama</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
