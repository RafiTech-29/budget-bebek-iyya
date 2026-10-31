import { Transaction, SavingsGoal, PriorityBill, BudgetCategory } from '../types';

// Bersih tanpa data palsu - siap untuk input data aktual pengguna
export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_PRIORITY_BILLS: PriorityBill[] = [];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [];

// Daftar Bank / Dompet yang diaktifkan pengguna:
export const BANK_OPTIONS = [
  'BCA (Utama)',
  'BNI (Terima Gaji)',
  'Sea Bank',
  'Shopee Pay',
] as const;

// Template 8 kategori jatah belanja Si Bebek dengan nominal 0 untuk diinput sendiri oleh pengguna
// Kategori laundry dibuat sama seperti yang lain (tidak opsional, tanpa tombol toggle)
export const INITIAL_BUDGETS: BudgetCategory[] = [
  {
    id: 'b-kos',
    name: 'Kos Bulanan',
    spent: 0,
    budget: 0,
    color: '#f59e0b',
  },
  {
    id: 'b-listrik',
    name: 'Listrik & Token',
    spent: 0,
    budget: 0,
    color: '#eab308',
  },
  {
    id: 'b-pokok',
    name: 'Kebutuhan Pokok',
    spent: 0,
    budget: 0,
    color: '#0284c7',
  },
  {
    id: 'b-makan',
    name: 'Makan & Minum',
    spent: 0,
    budget: 0,
    color: '#10b981',
  },
  {
    id: 'b-transp',
    name: 'Transportasi & Bensin',
    spent: 0,
    budget: 0,
    color: '#3b82f6',
  },
  {
    id: 'b-laundry',
    name: 'Laundry Kiloan',
    spent: 0,
    budget: 0,
    color: '#06b6d4',
  },
  {
    id: 'b-internet',
    name: 'Internet & Pulsa',
    spent: 0,
    budget: 0,
    color: '#8b5cf6',
  },
  {
    id: 'b-skincare',
    name: 'Skincare & Perawatan',
    spent: 0,
    budget: 0,
    color: '#f43f5e',
  },
  {
    id: 'b-hiburan',
    name: 'Hiburan & Nongkrong',
    spent: 0,
    budget: 0,
    color: '#14b8a6',
  },
  {
    id: 'b-lainnya',
    name: 'Kebutuhan Lainnya',
    spent: 0,
    budget: 0,
    color: '#84a98c',
  },
];

export const DUCKY_MASCOT_URL =
  '/src/assets/images/si_bebek_mascot_1792592453641.jpg';

export function formatIDR(value: number): string {
  const num = Math.round(value || 0);
  return 'Rp ' + num.toLocaleString('id-ID');
}

export function formatRibuan(raw: string | number): string {
  const clean = String(raw).replace(/\D/g, '');
  if (!clean) return '';
  return Number(clean).toLocaleString('id-ID');
}

export function parseIDRInput(raw: string): number {
  if (!raw) return 0;
  const clean = String(raw).replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

/**
 * Menghitung akumulasi pengeluaran aktual per kategori jatah berdasarkan data transaksi
 * yang diinput di menu Input Jajan Bebek secara realtime.
 */
export function getCategorySpentFromTransactions(
  categoryNameOrId: string,
  transactions: Transaction[]
): number {
  const targetLower = categoryNameOrId.toLowerCase();

  return transactions
    .filter((t) => t.type === 'Pengeluaran' || (!t.type && t.category !== 'Gaji' && t.category !== 'Tabungan'))
    .filter((t) => {
      const catLower = (t.category || '').toLowerCase();

      if (targetLower.includes('makan') && catLower.includes('makan')) return true;
      if (targetLower.includes('kos') && catLower.includes('kos')) return true;
      if (targetLower.includes('transp') && catLower.includes('transp')) return true;
      if (targetLower.includes('laundry') && catLower.includes('laundry')) return true;
      if (targetLower.includes('listrik') && catLower.includes('listrik')) return true;
      if (
        (targetLower.includes('pokok') || targetLower.includes('sabun') || targetLower.includes('shampo')) &&
        (catLower.includes('pokok') || catLower.includes('sabun') || catLower.includes('shampo'))
      ) {
        return true;
      }
      if (targetLower.includes('internet') && catLower.includes('internet')) return true;
      if (targetLower.includes('skincare') && catLower.includes('skincare')) return true;
      if (
        (targetLower.includes('hiburan') || targetLower.includes('jajan')) &&
        (catLower.includes('hiburan') || catLower.includes('jajan'))
      ) {
        return true;
      }
      if (targetLower.includes('lain') && catLower.includes('lain')) return true;

      return targetLower.includes(catLower) || catLower.includes(targetLower);
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);
}
