/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Transaction,
  SavingsGoal,
  BudgetCategory,
  ActiveTab,
} from './types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BUDGETS,
  getCategorySpentFromTransactions,
  formatIDR,
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { GoalModal, GuideModal, EditTransactionModal } from './components/Modals';
import { OverviewView } from './views/OverviewView';
import { TransactionsView } from './views/TransactionsView';
import { GoalsView } from './views/GoalsView';
import { InputJajanView } from './views/InputJajanView';
import { AlokasiAnggaranView } from './views/AlokasiAnggaranView';

// Bersihkan SEMUA data fake/lama untuk memulai budgeting real 100% aktual dari 0
if (typeof window !== 'undefined' && !localStorage.getItem('sibebek_v6_fresh_start_clean')) {
  localStorage.removeItem('sibebek_transactions');
  localStorage.setItem('sibebek_transactions', JSON.stringify([]));

  localStorage.removeItem('sibebek_goals');
  localStorage.setItem('sibebek_goals', JSON.stringify([]));

  const cleanBudgets = INITIAL_BUDGETS.map((b) => ({
    ...b,
    budget: 0,
    spent: 0,
    enabled: true,
    isOptional: false,
  }));
  localStorage.setItem('sibebek_budgets', JSON.stringify(cleanBudgets));
  localStorage.setItem('sibebek_prev_remaining', '0');

  localStorage.setItem('sibebek_v6_fresh_start_clean', 'true');
}

export default function App() {
  // Menu Utama: 'insights' | 'input-jajan' | 'catatan' | 'alokasi' | 'tabungan'
  const [activeTab, setActiveTab] = useState<ActiveTab>('insights');
  const [currentMonth, setCurrentMonth] = useState('Oktober 2026');

  // Transactions state - bersih tanpa data palsu
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sibebek_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Savings Goals state - bersih tanpa data palsu
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('sibebek_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAVINGS_GOALS;
  });

  // Budgets state - siap untuk diinput sendiri oleh pengguna di menu Jatah Si Bebek
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('sibebek_budgets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let list: BudgetCategory[] = [...parsed];
          if (!list.some((b: BudgetCategory) => b.id === 'b-listrik')) {
            list.splice(1, 0, { id: 'b-listrik', name: 'Listrik & Token', spent: 0, budget: 0, color: '#eab308' });
          }
          if (!list.some((b: BudgetCategory) => b.id === 'b-pokok')) {
            const idx = list.findIndex((b: BudgetCategory) => b.id === 'b-listrik');
            list.splice(idx >= 0 ? idx + 1 : 2, 0, { id: 'b-pokok', name: 'Kebutuhan Pokok', spent: 0, budget: 0, color: '#0284c7' });
          }
          return list.map((b: BudgetCategory) => ({
            ...b,
            enabled: true,
            isOptional: false,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BUDGETS;
  });

  // Sisa budget bulan sebelumnya state (default 0 untuk input aktual)
  const [previousMonthBudgetRemaining] = useState<number>(() => {
    const saved = localStorage.getItem('sibebek_prev_remaining');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return 0;
  });

  // Modals & Toast state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Floating Toast State & Auto-dismiss (Hanya pop-up sementara ~2.4 detik lalu otomatis hilang sendiri)
  const [globalToast, setGlobalToast] = useState<{ title: string; desc: string; icon?: string } | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (toast: { title: string; desc: string; icon?: string }, duration = 2400) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setGlobalToast(toast);
    toastTimeoutRef.current = setTimeout(() => {
      setGlobalToast(null);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('sibebek_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sibebek_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('sibebek_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Ref untuk mendebounce / mencegah double deposit
  const lastDepositRef = useRef<{ goalId: string; amount: number; time: number } | null>(null);

  // Perbaikan otomatis jika sebelumnya terjadi duplikasi data setoran tabungan
  useEffect(() => {
    // 1. Cek duplikasi transaksi tabungan yang terinput pada rentang waktu sangat dekat (< 1500ms)
    let hasDuplicate = false;
    const cleanTxs: Transaction[] = [];
    for (let i = 0; i < transactions.length; i++) {
      const cur = transactions[i];
      const prev = cleanTxs[cleanTxs.length - 1];
      if (
        prev &&
        cur.type === 'Tabungan' &&
        prev.type === 'Tabungan' &&
        cur.amount === prev.amount &&
        cur.description === prev.description &&
        Math.abs(cur.id - prev.id) < 1500
      ) {
        hasDuplicate = true;
        continue; // Abaikan transaksi duplikat
      }
      cleanTxs.push(cur);
    }
    if (hasDuplicate) {
      setTransactions(cleanTxs);
    }

    // 2. Koreksi g.current jika sebelumnya nilainya terlanjur terinput 2x lipat
    setSavingsGoals((prevGoals) => {
      let modified = false;
      const corrected = prevGoals.map((g) => {
        const relatedTxs = (hasDuplicate ? cleanTxs : transactions).filter(
          (t) =>
            (t.type === 'Tabungan' || t.category === 'Tabungan') &&
            (t.goalId === g.id || (t.description && t.description.includes(g.title)))
        );
        if (relatedTxs.length > 0) {
          const actualSum = relatedTxs.reduce((sum, t) => sum + t.amount, 0);
          if (g.current !== actualSum && g.current === actualSum * 2) {
            modified = true;
            return { ...g, current: actualSum };
          }
        }
        return g;
      });
      return modified ? corrected : prevGoals;
    });
  }, []);

  // Perhitungan dinamis dari data aktual transaksi
  const totalIncome = transactions
    .filter((t) => t.type === 'Pemasukan' || t.category === 'Gaji')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Pengeluaran' || (t.type !== 'Pemasukan' && t.type !== 'Tabungan'))
    .reduce((sum, t) => sum + t.amount, 0);

  // Total Tabungan dihitung secara akurat dari transaksi setoran tabungan aktual
  // (TIDAK dijumlahkan ganda dengan savingsGoals agar tidak berlipat ganda)
  const totalSavings = useMemo(() => {
    const txSavings = transactions
      .filter((t) => t.type === 'Tabungan' || t.category === 'Tabungan')
      .reduce((sum, t) => sum + t.amount, 0);
    const goalsSavings = savingsGoals.reduce((sum, g) => sum + (g.current || 0), 0);
    return Math.max(txSavings, goalsSavings);
  }, [transactions, savingsGoals]);

  // Akumulasi pengeluaran per kategori jatah dihitung dinamis dari data transaksi aktual
  // Terpakai atau tidaknya sesuai data aktual yang diinput di Input Jajan Bebek
  const budgetsWithActualSpent = useMemo(() => {
    return budgets.map((b) => {
      const spent = getCategorySpentFromTransactions(b.name, transactions);
      return {
        ...b,
        spent,
        enabled: true,
      };
    });
  }, [budgets, transactions]);

  // Add Transaction Handler (Hanya dari menu Input Jajan Bebek & modal Catatan)
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id' | 'balance'>) => {
    const isTabungan = newTxData.type === 'Tabungan' || newTxData.category === 'Tabungan';
    const newTx: Transaction = {
      ...newTxData,
      id: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Jika transaksi yang diinput adalah Tabungan, perbarui juga saldo tabungan pada target aktif jika ada
    if (isTabungan && savingsGoals.length > 0) {
      setSavingsGoals((prev) => [
        {
          ...prev[0],
          current: (prev[0].current || 0) + newTx.amount,
        },
        ...prev.slice(1),
      ]);
    }

    showToast({
      title: isTabungan
        ? 'Setoran Tabungan Disimpan! 🪙'
        : newTx.type === 'Pengeluaran'
        ? 'Jajan Si Bebek Disimpan! 🐤'
        : 'Uang Si Bebek Disimpan! 🐣',
      desc: `${newTx.category} (${newTx.description}) senilai ${formatIDR(newTx.amount)} telah tercatat! Sisa saldo kas otomatis terpotong.`,
      icon: isTabungan ? '🪙' : newTx.type === 'Pengeluaran' ? '🐤' : '🐣',
    });
  };

  // Delete Transaction (Dari menu Catatan Si Bebek)
  // Jika transaksi yang dihapus adalah setoran tabungan yang terhubung ke target, kurangi saldo targetnya
  const handleDeleteTransaction = (id: number) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx && (tx.type === 'Tabungan' || tx.category === 'Tabungan')) {
      setSavingsGoals((prev) =>
        prev.map((g) => {
          if (tx.goalId === g.id || (tx.description && tx.description.includes(g.title))) {
            return { ...g, current: Math.max(0, (g.current || 0) - tx.amount) };
          }
          return g;
        })
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast({
      title: 'Catatan Berhasil Dihapus! 🗑️',
      desc: tx ? `Catatan "${tx.description}" telah dihapus.` : 'Catatan transaksi telah dihapus.',
      icon: '🗑️',
    });
  };

  // Edit Transaction (Dari menu Catatan Si Bebek)
  // Jika transaksi yang diedit adalah setoran tabungan, sesuaikan selisih nominalnya pada target
  const handleUpdateTransaction = (updatedTx: Transaction) => {
    const oldTx = transactions.find((t) => t.id === updatedTx.id);
    if (oldTx && (updatedTx.type === 'Tabungan' || updatedTx.category === 'Tabungan')) {
      const diff = updatedTx.amount - oldTx.amount;
      if (diff !== 0) {
        setSavingsGoals((prev) =>
          prev.map((g) => {
            if (updatedTx.goalId === g.id || (updatedTx.description && updatedTx.description.includes(g.title))) {
              return { ...g, current: Math.max(0, (g.current || 0) + diff) };
            }
            return g;
          })
        );
      }
    }
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    );
  };

  // Update alokasi jatah anggaran kategori
  const handleUpdateBudget = (id: string, newBudget: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, budget: newBudget } : b))
    );
  };

  // Tabung Koin Cepat (+10.000)
  const handleQuickCoinDeposit = () => {
    const goalId = savingsGoals.length > 0 ? savingsGoals[0].id : undefined;
    const goalTitle = savingsGoals.length > 0 ? savingsGoals[0].title : 'Celengan Bebek';

    const coinTx: Transaction = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      category: 'Tabungan',
      description: `Tabungan koin harian: ${goalTitle}`,
      bank: 'BCA (Utama)',
      type: 'Tabungan',
      amount: 10000,
      loggedToJournal: true,
      goalId,
    };

    setTransactions((prev) => [coinTx, ...prev]);

    if (savingsGoals.length > 0) {
      setSavingsGoals((prev) => [
        {
          ...prev[0],
          current: (prev[0].current || 0) + 10000,
        },
        ...prev.slice(1),
      ]);
    }
  };

  // Tambah Target Tabungan Baru
  const handleAddGoal = (newGoalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...newGoalData,
      id: 'goal-' + Date.now(),
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  // Hapus Target Tabungan (jika batal menabung)
  // Menghapus target DAN transaksi setoran yang terkait dengan target ini di Catatan Si Bebek
  const handleDeleteGoal = (goalId: string) => {
    const deleted = savingsGoals.find((g) => g.id === goalId);
    setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
    setTransactions((prev) =>
      prev.filter(
        (t) =>
          t.goalId !== goalId &&
          !(deleted && t.description && t.description.includes(deleted.title))
      )
    );
    showToast({
      title: 'Tabungan Berhasil Dihapus! 🗑️',
      desc: deleted
        ? `Target "${deleted.title}" telah dihapus dari daftar tabungan impian.`
        : 'Target tabungan telah dihapus.',
      icon: '🗑️',
    });
  };

  // Setor Dana ke Target Tabungan:
  // - Nilai terinput bertambah tepat sesuai nominal yang diinputkan
  // - Setiap kali input lagi, nominal bertambah secara akumulatif
  // - Terproteksi dari double click submit
  const handleDepositToGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;

    // Cegah multi-submit / double click (< 800ms)
    const now = Date.now();
    if (
      lastDepositRef.current &&
      lastDepositRef.current.goalId === goalId &&
      lastDepositRef.current.amount === amount &&
      now - lastDepositRef.current.time < 800
    ) {
      return;
    }
    lastDepositRef.current = { goalId, amount, time: now };

    const goal = savingsGoals.find((g) => g.id === goalId);
    const goalTitle = goal ? goal.title : 'Target Impian';

    // Update nominal target tabungan: bertambah tepat sesuai amount
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, current: (g.current || 0) + amount } : g))
    );

    // Catat HANYA 1 transaksi setoran ke catatan
    const tx: Transaction = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      category: 'Tabungan',
      description: `Setoran tabungan: ${goalTitle}`,
      bank: 'BCA (Utama)',
      type: 'Tabungan',
      amount,
      loggedToJournal: true,
      goalId,
    };
    setTransactions((prev) => [tx, ...prev]);

    showToast({
      title: 'Setoran Berhasil! 🪙',
      desc: `Berhasil menabung ${formatIDR(amount)} ke target "${goalTitle}". Sisa saldo kas otomatis terpotong.`,
      icon: '🪙',
    });
  };

  // Sisa Saldo Realtime bulan berjalan = Sisa bulan lalu + Total Pemasukan - Total Pengeluaran - Total Tabungan
  const sisaSaldoRealtime = previousMonthBudgetRemaining + totalIncome - totalExpense - totalSavings;

  // Pergantian bulan: sisa saldo di bulan berjalan akan masuk sebagai kategori pemasukan di bulan berikutnya secara otomatis
  const handleMonthChange = (newMonth: string) => {
    if (newMonth === currentMonth) return;

    const endingBalance = sisaSaldoRealtime;

    // Jika sisa saldo positif, masukkan otomatis sebagai kategori pemasukan di bulan berikutnya
    if (endingBalance > 0) {
      const rolloverDescription = `Sisa Saldo Bulan Lalu (${currentMonth})`;

      // Cek apakah transaksi rollover untuk bulan tersebut sudah tercatat
      const alreadyLogged = transactions.some(
        (t) => t.description === rolloverDescription && t.type === 'Pemasukan'
      );

      if (!alreadyLogged) {
        const monthMap: Record<string, string> = {
          'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
          'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
          'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12',
        };
        const [mName, mYear] = newMonth.split(' ');
        const mNum = monthMap[mName] || '01';
        const formattedDate = `01/${mNum}/${mYear || '2026'}`;

        const autoIncomeTx: Transaction = {
          id: Date.now(),
          date: formattedDate,
          category: 'Gaji',
          description: rolloverDescription,
          amount: endingBalance,
          bank: 'BCA (Utama)',
          type: 'Pemasukan',
          loggedToJournal: true,
        };

        setTransactions((prev) => [autoIncomeTx, ...prev]);
      }
    }

    setCurrentMonth(newMonth);
  };

  // Bersihkan semua data untuk memulai budgeting real dari nol
  const handleResetData = () => {
    localStorage.removeItem('sibebek_transactions');
    localStorage.removeItem('sibebek_goals');
    localStorage.removeItem('sibebek_budgets');
    localStorage.removeItem('sibebek_prev_remaining');

    setTransactions([]);
    setSavingsGoals([]);
    const freshBudgets = INITIAL_BUDGETS.map((b) => ({
      ...b,
      budget: 0,
      spent: 0,
      enabled: true,
      isOptional: false,
    }));
    setBudgets(freshBudgets);

    showToast({
      title: 'Semua Data Dihapus Bersih! 🧹',
      desc: 'Buku catatan transaksi, jatah belanja, dan tabungan telah dikosongkan. Siap input dari awal.',
      icon: '🧹',
    });
  };

  return (
    <div className="min-h-screen bg-background font-nunito text-on-surface antialiased flex flex-col">
      {/* Top Fixed Header */}
      <Header
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 w-full">
        <main className="pt-20 sm:pt-24 min-h-screen w-full px-3 sm:px-4 lg:px-6 pb-28 lg:pb-12">
          {/* Menu 1: Insight Si Bebek = Laporan keseluruhan */}
          {activeTab === 'insights' && (
            <OverviewView
              currentMonth={currentMonth}
              previousMonthBudgetRemaining={previousMonthBudgetRemaining}
              transactions={transactions}
              budgets={budgetsWithActualSpent}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalSavings={totalSavings}
              onOpenGuide={() => setIsGuideModalOpen(true)}
              onNavigateToAlokasi={() => setActiveTab('alokasi')}
            />
          )}

          {/* Menu 2: Jatah Si Bebek = Limit & alokasi anggaran belanja per kategori */}
          {activeTab === 'alokasi' && (
            <AlokasiAnggaranView
              budgets={budgetsWithActualSpent}
              onUpdateBudget={handleUpdateBudget}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalSavings={totalSavings}
              previousMonthBudgetRemaining={previousMonthBudgetRemaining}
            />
          )}

          {/* Menu 3: Input Jajan Bebek = Menu untuk menginput transaksi baru */}
          {activeTab === 'input-jajan' && (
            <InputJajanView
              onAddTransaction={handleAddTransaction}
              onNavigateToCatatan={() => setActiveTab('catatan')}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalSavings={totalSavings}
              previousMonthBudgetRemaining={previousMonthBudgetRemaining}
            />
          )}

          {/* Menu 4: Catatan Si Bebek = Catatan pengeluaran, pemasukan & tabungan */}
          {activeTab === 'catatan' && (
            <TransactionsView
              transactions={transactions}
              previousMonthBudgetRemaining={previousMonthBudgetRemaining}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalSavings={totalSavings}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={(t) => setEditingTransaction(t)}
              onNavigateToInput={() => setActiveTab('input-jajan')}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {/* Menu 5: Tabungan Si Bebek = Informasi terkait tabungan */}
          {(activeTab === 'tabungan' || (activeTab as string) === 'celengan') && (
            <GoalsView
              goals={savingsGoals}
              totalSavings={totalSavings}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              previousMonthBudgetRemaining={previousMonthBudgetRemaining}
              onOpenAddGoal={() => setIsGoalModalOpen(true)}
              onDepositToGoal={handleDepositToGoal}
              onQuickCoinDeposit={handleQuickCoinDeposit}
              onDeleteGoal={handleDeleteGoal}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Muncul hanya di smartphone / layar kecil) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Target Tabungan Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleAddGoal}
      />

      {/* Panduan Jurnal Si Bebek Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Ubah Transaksi Modal */}
      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onUpdate={handleUpdateTransaction}
      />

      {/* Global Floating Toast (Pop-up sementara ~2.4 detik lalu otomatis hilang sendiri) */}
      {globalToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] sm:w-auto p-3.5 sm:p-4 rounded-2xl bg-surface-container-lowest text-on-surface border-2 border-primary shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{globalToast.icon || '✨'}</span>
            <div>
              <div className="font-extrabold text-xs text-primary">{globalToast.title}</div>
              <div className="text-[11px] font-semibold text-on-surface mt-0.5">{globalToast.desc}</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
              setGlobalToast(null);
            }}
            className="w-6 h-6 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-xs cursor-pointer ml-2 text-outline hover:text-on-surface transition-colors"
            title="Tutup"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
