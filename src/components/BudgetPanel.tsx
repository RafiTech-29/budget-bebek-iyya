import React from 'react';
import { BudgetCategory } from '../types';
import { formatIDR } from '../data/initialData';

interface BudgetPanelProps {
  budgets: BudgetCategory[];
  totalSpent: number;
  totalBudget: number;
}

export const BudgetPanel: React.FC<BudgetPanelProps> = ({
  budgets,
  totalSpent,
  totalBudget,
}) => {
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 65;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 shadow-sm border border-surface-container-highest flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-tertiary-fixed flex items-center justify-center text-base shadow-2xs">
              🐣
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Anggaran Si Bebek</h3>
              <p className="text-[11px] text-outline font-semibold">Realisasi per pos kategori</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant font-bold">
            Total: {overallPercentage}%
          </span>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          {budgets.map((item) => {
            const pct = Math.min(100, Math.round((item.spent / item.budget) * 100));
            const remaining = item.budget - item.spent;

            if (item.isParent) {
              return (
                <div key={item.id} className="bg-surface-container-low p-3 rounded-xl border border-surface-container-highest">
                  <div className="flex justify-between items-center text-xs font-bold text-primary mb-1">
                    <span className="flex items-center gap-1">
                      <span>🐥</span>
                      <span>{item.name}</span>
                    </span>
                    <span>
                      {formatIDR(item.spent)} / {formatIDR(item.budget)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-outline mt-1">
                    <span>{pct}% Terpakai</span>
                    <span>Sisa: {formatIDR(remaining)}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span>{item.name}</span>
                  </span>
                  <span className="text-on-surface-variant text-[11px]">
                    {formatIDR(item.spent)} / {formatIDR(item.budget)}
                  </span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Footer */}
      <div className="mt-4 pt-2 border-t border-surface-container flex justify-between items-center bg-surface-container-low px-3 py-2 rounded-xl">
        <span className="text-xs font-bold text-on-surface flex items-center gap-1">
          <span>🐾</span>
          <span>Total Anggaran Si Bebek</span>
        </span>
        <div className="text-right">
          <span className="text-xs text-primary font-bold">{formatIDR(totalSpent)}</span>
          <span className="text-outline text-[11px] font-semibold"> / {formatIDR(totalBudget)}</span>
        </div>
      </div>
    </div>
  );
};
