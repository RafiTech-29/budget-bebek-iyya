import React, { useState } from 'react';

interface ChartPanelProps {
  totalExpenseMillion?: string;
  dailyAverage?: string;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  totalExpenseMillion = '3.25 jt',
  dailyAverage = 'Rp 130.000/hari',
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const monthData = [
    { name: 'Jun', inH: 45, outH: 32, inVal: '4.8 jt', outVal: '3.1 jt' },
    { name: 'Jul', inH: 48, outH: 28, inVal: '5.2 jt', outVal: '2.8 jt' },
    { name: 'Agu', inH: 50, outH: 35, inVal: '5.5 jt', outVal: '3.3 jt' },
    { name: 'Sep', inH: 52, outH: 38, inVal: '5.6 jt', outVal: '3.5 jt' },
    { name: 'Okt', inH: 55, outH: 32, inVal: '5.7 jt', outVal: '3.25 jt', isCurrent: true },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-container-highest flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-base shadow-2xs">
              🐥
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Grafik & Analisis</h3>
              <p className="text-[11px] text-outline font-semibold">Tren & Komposisi Bebek</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-outline">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>Masuk 🐣
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>Keluar 🐤
            </span>
          </div>
        </div>

        {/* Chart 1: Bar Chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface font-bold flex items-center gap-1">
              <span>🐾</span>
              <span>Tren Bulanan (Jun - Okt 2026)</span>
            </span>
            {hoveredMonth && (
              <span className="text-[11px] text-primary font-bold animate-in fade-in">
                {hoveredMonth}
              </span>
            )}
          </div>
          <div className="h-32 w-full pt-2">
            <svg className="w-full h-full text-outline" preserveAspectRatio="none" viewBox="0 0 340 100">
              {/* Grid horizontal lines */}
              <line stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.15" x1="20" x2="330" y1="20" y2="20" />
              <line stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.15" x1="20" x2="330" y1="50" y2="50" />
              <line stroke="currentColor" strokeOpacity="0.2" x1="20" x2="330" y1="80" y2="80" />

              {monthData.map((m, idx) => {
                const xIn = 35 + idx * 60;
                const xOut = xIn + 12;
                const xCenter = xIn + 11;
                const isCur = m.isCurrent;

                return (
                  <g
                    key={m.name}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredMonth(`${m.name}: Masuk ${m.inVal} • Keluar ${m.outVal}`)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <rect
                      x={xIn}
                      y={80 - m.inH}
                      width="10"
                      height={m.inH}
                      rx="3"
                      fill={isCur ? '#2d4833' : '#416347'}
                      className="transition-all hover:opacity-80"
                    />
                    <rect
                      x={xOut}
                      y={80 - m.outH}
                      width="10"
                      height={m.outH}
                      rx="3"
                      fill={isCur ? '#9b5a38' : '#fad0bc'}
                      className="transition-all hover:opacity-80"
                    />
                    <text
                      x={xCenter}
                      y="93"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight={isCur ? 'bold' : 'normal'}
                      fill={isCur ? '#2d4833' : '#767d73'}
                    >
                      {m.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 2: Donut Chart */}
        <div className="pt-2 border-t border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface font-bold flex items-center gap-1">
              <span>🐥</span>
              <span>Pengeluaran per Kategori</span>
            </span>
            {hoveredSlice && (
              <span className="text-[11px] text-secondary font-bold animate-in fade-in">
                {hoveredSlice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f5f0e4" strokeWidth="6.5" />
                {/* Kos: 31% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#9b5a38"
                  strokeWidth="6.5"
                  strokeDasharray="31 69"
                  strokeDashoffset="0"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredSlice('Kos: 31% (Rp 1.000.000)')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Makan: 20% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#416347"
                  strokeWidth="6.5"
                  strokeDasharray="20 80"
                  strokeDashoffset="-31"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredSlice('Makan: 20% (Rp 650.000)')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Transp: 12% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#fad0bc"
                  strokeWidth="6.5"
                  strokeDasharray="12 88"
                  strokeDashoffset="-51"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredSlice('Transportasi: 12% (Rp 300.000)')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Laundry: 8% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#82660a"
                  strokeWidth="6.5"
                  strokeDasharray="8 92"
                  strokeDashoffset="-63"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredSlice('Laundry: 8% (Rp 50.000)')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Skincare: 6% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#e03131"
                  strokeWidth="6.5"
                  strokeDasharray="6 94"
                  strokeDashoffset="-71"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredSlice('Skincare: 6% (Rp 65.000)')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                {/* Lainnya: 23% */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#c8cec5"
                  strokeWidth="6.5"
                  strokeDasharray="23 77"
                  strokeDashoffset="-77"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredSlice('Lainnya & Celengan: 23%')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-outline font-semibold leading-tight">Total</span>
                <span className="text-[11px] font-extrabold text-on-surface">{totalExpenseMillion}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs w-full font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0"></span>
                <span className="text-on-surface">Kos (31%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container flex-shrink-0"></span>
                <span className="text-on-surface">Makan (20%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim flex-shrink-0"></span>
                <span className="text-on-surface">Transp (12%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container flex-shrink-0"></span>
                <span className="text-on-surface">Laundry (8%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-error flex-shrink-0"></span>
                <span className="text-on-surface">Skincare (6%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant flex-shrink-0"></span>
                <span className="text-on-surface">Lainnya (23%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 text-center text-xs text-outline font-semibold border-t border-surface-container flex items-center justify-center gap-1">
        <span>🐾</span>
        <span>Rata-rata belanja harian:</span>
        <strong className="text-on-surface">{dailyAverage}</strong>
      </div>
    </div>
  );
};
