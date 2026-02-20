import { loadData, saveData, loadSeed } from './storage.js';

export const state = {
  transactions: [],
  budgets: [],
  
  async init() {
    let data = loadData();
    if (!data) {
      data = await loadSeed();
    }
    this.transactions = data.transactions || [];
    this.budgets = data.budgets || [];
  },

  addTransaction(txn) {
    this.transactions.push(txn);
    this.persist();
  },

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.persist();
  },

  addBudget(budget) {
    this.budgets.push(budget);
    this.persist();
  },

  deleteBudget(id) {
    this.budgets = this.budgets.filter(b => b.id !== id);
    this.persist();
  },

  reallocateBudget(id, newLimit) {
    const budget = this.budgets.find(b => b.id === id);
    if (budget) {
      budget.limit = newLimit;
      this.persist();
    }
  },

  persist() {
    saveData({
      transactions: this.transactions,
      budgets: this.budgets
    });
  },

  getStats() {
    let income = 0;
    let expenses = 0;
    const categoryTotals = {};

    this.transactions.forEach(t => {
      if (t.type === 'credit') {
        income += parseFloat(t.amount);
      } else {
        expenses += parseFloat(t.amount);
        const cat = t.category || 'Uncategorized';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(t.amount);
      }
    });

    const topSpendings = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount }));

    return { income, expenses, balance: income - expenses, topSpendings };
  },

  getBudgetStats() {
    return this.budgets.map(b => {
      const spent = this.transactions
        .filter(t => t.type === 'debit' && t.category === b.name)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return {
        ...b,
        spent,
        percentage: b.limit > 0 ? (spent / b.limit) * 100 : 0
      };
    });
  }
};
