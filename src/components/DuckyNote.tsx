import React, { useState } from 'react';

const SI_BEBEK_NOTES = [
  'Pelan-pelan saja, Si Bebek. Konsisten mencatat setiap rupiah adalah langkah awal menuju keuangan yang lebih tenang dan terarah. Kamu sudah melakukan hal yang baik sekali hari ini! ✨',
  'Menghemat bukan berarti membatasi kebahagiaan, tapi memilih apa yang paling berharga untuk masa depanmu ♡',
  'Setiap koin yang kamu masukkan ke celengan hari ini adalah senyuman lega di hari esok. Tetap semangat, ya! 🐥',
  'Catat pengeluaran tanpa rasa bersalah. Yang penting kita sadar dan belajar terus bersama Si Bebek 🌿',
];

export const DuckyNote: React.FC = () => {
  const [noteIndex, setNoteIndex] = useState(0);

  const handleNext = () => {
    setNoteIndex((prev) => (prev + 1) % SI_BEBEK_NOTES.length);
  };

  return (
    <div
      onClick={handleNext}
      className="bg-surface-container-low rounded-2xl p-4 shadow-2xs border border-surface-container-highest flex items-center justify-between gap-3.5 cursor-pointer hover:bg-surface-container transition-all group"
      title="Klik untuk membaca catatan Si Bebek berikutnya ♡"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/50 flex-shrink-0 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
          🐥
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-tertiary font-bold">Catatan Si Bebek</span>
            <span className="text-tertiary text-xs">♡</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
            {SI_BEBEK_NOTES[noteIndex]}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-center justify-center text-primary pr-2 opacity-80 flex-shrink-0">
        <span className="text-xl">🌿</span>
        <span className="text-[10px] font-bold">Mindful</span>
      </div>
    </div>
  );
};
