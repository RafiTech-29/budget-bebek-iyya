import React, { useState, useRef, useEffect } from 'react';

interface MiniCalendarPickerProps {
  value: string; // Formatted as "DD/MM/YYYY" or "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const MiniCalendarPicker: React.FC<MiniCalendarPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Pilih tanggal',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value (expected DD/MM/YYYY)
  const parseDateValue = (str: string): Date => {
    if (!str) return new Date();
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
    } else if (str.includes('-')) {
      const parts = str.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
    }
    return new Date();
  };

  const parsedDate = parseDateValue(value);

  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Sync view when value changes from outside
  useEffect(() => {
    const d = parseDateValue(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const result = `${formattedDay}/${formattedMonth}/${viewYear}`;
    onChange(result);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const formattedDay = String(today.getDate()).padStart(2, '0');
    const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
    const result = `${formattedDay}/${formattedMonth}/${today.getFullYear()}`;
    onChange(result);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    setIsOpen(false);
  };

  // Calendar matrix calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;

  // Selected date check
  const isSelectedDay = (day: number) => {
    return (
      parsedDate.getFullYear() === viewYear &&
      parsedDate.getMonth() === viewMonth &&
      parsedDate.getDate() === day
    );
  };

  return (
    <div className={`relative flex flex-col gap-1 w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-outline flex items-center gap-1">
          <span>🗓️</span>
          <span>{label}</span>
        </label>
      )}

      {/* Button Input yang Membuka Kalender Mini */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-highest flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors shadow-2xs text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm">📅</span>
          <span className={value ? 'text-on-surface font-extrabold' : 'text-outline font-medium'}>
            {value || placeholder}
          </span>
        </span>
        <span className="text-[10px] text-outline font-bold px-2 py-0.5 rounded-full bg-surface-container-high">
          Pilih Kalender ▼
        </span>
      </button>

      {/* Pop-up Kalender Mini */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-72 p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-highest shadow-xl animate-in fade-in zoom-in-95">
          {/* Header Kalender Mini */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-surface-container">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg hover:bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
              title="Bulan sebelumnya"
            >
              ◀
            </button>

            <div className="flex items-center gap-1 font-extrabold text-xs text-on-surface">
              <span>{MONTH_NAMES[viewMonth]}</span>
              <span className="text-primary">{viewYear}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg hover:bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
              title="Bulan berikutnya"
            >
              ▶
            </button>
          </div>

          {/* Baris Nama Hari */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_LABELS.map((d, i) => (
              <span
                key={d}
                className={`text-[10px] font-bold py-0.5 ${
                  i === 0 ? 'text-rose-500' : 'text-outline'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Grid Tanggal Mini */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank cells for padding before 1st day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="w-8 h-8" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = isSelectedDay(day);
              const isToday = isCurrentMonthToday && today.getDate() === day;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-xs font-black scale-105'
                      : isToday
                      ? 'bg-primary-container text-primary font-black border border-primary/40'
                      : 'hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Kalender: Tombol Hari Ini & Batal */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-surface-container text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-primary-container hover:text-primary text-[11px] font-bold text-on-surface transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>🐥</span>
              <span>Hari Ini</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-outline hover:text-on-surface cursor-pointer"
            >
              Tutup ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
