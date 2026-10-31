export type TransactionType = 'Pengeluaran' | 'Pemasukan' | 'Tabungan' | 'Transfer';

export type CategoryType =
  | 'Makan'
  | 'Kos'
  | 'Listrik'
  | 'Kebutuhan Pokok'
  | 'Gaji'
  | 'Transportasi'
  | 'Skincare'
  | 'Laundry'
  | 'Internet'
  | 'Tabungan'
  | 'Hiburan'
  | 'Lainnya';

export type PriorityType = 'Wajib' | 'Penting' | 'Opsional';

export type BankType = 'BCA (Utama)' | 'BNI (Terima Gaji)' | 'Sea Bank' | 'Shopee Pay';

export interface Transaction {
  id: number;
  date: string;
  category: CategoryType | string;
  description: string;
  amount: number;
  bank: string;
  priority?: PriorityType;
  type?: TransactionType;
  loggedToJournal?: boolean;
  balance?: number;
  goalId?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface PriorityBill {
  id: string;
  title: string;
  amount: number;
  status: 'Lunas' | 'Belum Bayar' | 'Sebagian (75%)' | 'Sebagian';
  icon: string;
  color: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
  isParent?: boolean;
  isOptional?: boolean;
  enabled?: boolean;
}

// Menu Utama Si Bebek:
// 1. Insight Si Bebek (laporan keseluruhan)
// 2. Jatah Si Bebek (limit & alokasi anggaran belanja per kategori)
// 3. Input Jajan Bebek (menu input transaksi pengeluaran & pemasukan)
// 4. Catatan Si Bebek (catatan pengeluaran, pemasukan, & tabungan)
// 5. Tabungan Si Bebek (informasi tabungan impian Si Bebek)
export type ActiveTab = 'insights' | 'alokasi' | 'input-jajan' | 'catatan' | 'tabungan';
