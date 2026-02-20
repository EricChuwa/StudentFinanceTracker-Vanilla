import { state } from './state.js';
import { compileRegex, highlight, escapeHTML } from './search.js';
import { validateInput, regexRules } from './validators.js';
import { renderCharts } from './charts.js';

const DOM = {
  dashIncome: document.getElementById('dash-income'),
  dashExpenses: document.getElementById('dash-expenses'),
  dashBalance: document.getElementById('dash-balance'),
  dashBudgetAnalysis: document.getElementById('dash-budget-analysis'),
  
  tbodyTxn: document.getElementById('tbody-transactions'),
  mobileTxn: document.getElementById('mobile-transactions'),
  budgetsContainer: document.getElementById('budgets-container'),
  txnCategorySelect: document.getElementById('txn-category'),
  
  formTxn: document.getElementById('form-transaction'),
  formBudget: document.getElementById('form-budget'),
  
  searchTxn: document.getElementById('search-txn'),
  searchError: document.getElementById('search-error'),
  sortTxn: document.getElementById('sort-txn'),
  
  txnType: document.getElementById('txn-type'),
  budgetGroup: document.getElementById('budget-group')
};

export function initUI() {
  renderDashboard();
  renderTransactions();
  renderBudgets();
  populateBudgetSelect();
  setupEventListeners();
}

function setupEventListeners() {
  DOM.txnType.addEventListener('change', (e) => {
    DOM.budgetGroup.style.display = e.target.value === 'debit' ? 'block' : 'none';
  });

  DOM.formTxn.addEventListener('submit', handleTransactionSubmit);
  DOM.formBudget.addEventListener('submit', handleBudgetSubmit);

  DOM.searchTxn.addEventListener('input', renderTransactions);
  DOM.sortTxn.addEventListener('change', renderTransactions);

  DOM.tbodyTxn.addEventListener('click', handleDeleteTxn);
  DOM.mobileTxn.addEventListener('click', handleDeleteTxn);
  
  DOM.budgetsContainer.addEventListener('click', handleBudgetActions);
}

function renderDashboard() {
  const stats = state.getStats();
  const bStats = state.getBudgetStats();
  
  if (DOM.dashIncome) DOM.dashIncome.innerHTML = `${stats.income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style="font-size: 0.6em; font-weight: normal;">RWF</span>`;
  if (DOM.dashExpenses) DOM.dashExpenses.innerHTML = `${stats.expenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style="font-size: 0.6em; font-weight: normal;">RWF</span>`;
  if (DOM.dashBalance) {
    DOM.dashBalance.innerHTML = `${stats.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style="font-size: 0.6em; font-weight: normal;">RWF</span>`;
    DOM.dashBalance.className = stats.balance < 0 ? 'stat text-danger' : 'stat text-success';
  }

  // Budget Analysis on Dashboard
  if (DOM.dashBudgetAnalysis) {
    DOM.dashBudgetAnalysis.innerHTML = bStats.length ? bStats.map(b => {
      const overBudget = b.spent > b.limit;
      return `
        <div class="mb-2">
          <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 4px;">
            <span>${escapeHTML(b.name)}</span>
            <span class="${overBudget ? 'text-danger font-bold' : ''}">${b.percentage.toFixed(1)}%</span>
          </div>
          <div class="progress-bar" style="height: 6px;">
            <div class="progress-fill ${overBudget ? 'danger' : (b.percentage > 80 ? 'warning' : '')}" style="width: ${Math.min(100, b.percentage)}%"></div>
          </div>
          ${overBudget ? '<div class="text-danger" style="font-size: 0.75rem; margin-top: 2px; font-weight: 600;">You have gone over the budget</div>' : ''}
        </div>
      `;
    }).join('') : '<p class="text-secondary">No budgets defined</p>';
  }

  // Render chart
  const categoryTotals = {};
  state.transactions.filter(t => t.type === 'debit').forEach(t => {
    const cat = t.category || 'Uncategorized';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });
  const chartData = Object.entries(categoryTotals).map(([name, amount]) => ({ name, amount }));
  renderCharts('spending-chart', chartData);
}

function renderTransactions() {
  let txns = [...state.transactions];
  
  // Sort
  const sortVal = DOM.sortTxn.value;
  if (sortVal) {
    txns.sort((a, b) => {
      if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortVal === 'desc-asc') return a.description.localeCompare(b.description);
      if (sortVal === 'amount-desc') return b.amount - a.amount;
      return 0;
    });
  }

  // Search
  const query = DOM.searchTxn.value;
  const flags = 'i'; // For Case insensitve searches
  const re = compileRegex(query, flags);
  
  if (query && !re) {
    DOM.searchError.textContent = "Invalid regular expression";
    DOM.searchTxn.setAttribute('aria-invalid', 'true');
  } else {
    DOM.searchError.textContent = "";
    DOM.searchTxn.removeAttribute('aria-invalid');
  }

  if (re) {
    txns = txns.filter(t => 
      re.test(t.description) || 
      re.test(t.amount.toString()) || 
      re.test(t.date) || 
      re.test(t.category) ||
      re.test(t.senderRecipient)
    );
  }

  // Desktop render
  DOM.tbodyTxn.innerHTML = txns.length ? txns.map(t => {
    const desc = re ? highlight(t.description, re) : escapeHTML(t.description);
    const amountStr = t.amount.toLocaleString(undefined, {minimumFractionDigits: 2});
    const amount = re ? highlight(amountStr, re) : amountStr;
    const date = re ? highlight(t.date, re) : t.date;
    const cat = re ? highlight(t.category || '-', re) : escapeHTML(t.category || '-');
    const sender = re ? highlight(t.senderRecipient, re) : escapeHTML(t.senderRecipient);

    return `
      <tr data-testid="row-txn-${t.id}">
        <td>${date}</td>
        <td><strong>${desc}</strong></td>
        <td>${cat}</td>
        <td>${sender}</td>
        <td class="${t.type === 'credit' ? 'text-success' : 'text-danger'}">
          ${t.type === 'credit' ? '+' : '-'}${amount} RWF
        </td>
        <td>
          <button class="btn btn-danger btn-delete" data-id="${t.id}" aria-label="Delete ${escapeHTML(t.description)}" data-testid="button-delete-${t.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="6" class="text-center text-secondary">No transactions found</td></tr>`;

  // Mobile render
  DOM.mobileTxn.innerHTML = txns.length ? txns.map(t => {
    const desc = re ? highlight(t.description, re) : escapeHTML(t.description);
    const amountStr = t.amount.toLocaleString(undefined, {minimumFractionDigits: 2});
    const amount = re ? highlight(amountStr, re) : amountStr;
    return `
      <div class="card elevate mb-2" style="margin-bottom: 8px;" data-testid="card-txn-${t.id}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">${desc}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${t.date} &bull; ${escapeHTML(t.category || '-')}</div>
          </div>
          <div style="text-align:right;">
             <div class="${t.type === 'credit' ? 'text-success' : 'text-danger'}" style="font-weight: 600;">
                ${t.type === 'credit' ? '+' : '-'}${amount}
             </div>
             <button class="btn btn-danger btn-delete mt-2" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.8rem;">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('') : `<div class="card"><div class="text-center text-secondary">No transactions found</div></div>`;
}

function renderBudgets() {
  const bStats = state.getBudgetStats();
  DOM.budgetsContainer.innerHTML = bStats.length ? bStats.map(b => {
    const overBudget = b.spent > b.limit;
    const fillClass = overBudget ? 'danger' : (b.percentage > 80 ? 'warning' : '');
    return `
      <article class="card elevate budget-tile" data-testid="card-budget-${b.id}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div class="budget-header" style="flex:1;">
            <div class="budget-img">🏦</div>
            <div class="budget-info">
              <div class="budget-name">${escapeHTML(b.name)}</div>
              <div class="budget-stats">${b.spent.toLocaleString()} / ${b.limit.toLocaleString()} RWF</div>
            </div>
          </div>
          <div class="budget-actions" style="display:flex; gap: 4px;">
            <button class="icon-btn btn-reallocate" data-id="${b.id}" title="Reallocate Funds" aria-label="Reallocate Funds">
              <svg style="width:16px; height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="icon-btn btn-delete-budget" data-id="${b.id}" title="Delete Budget" aria-label="Delete Budget">
              <svg style="width:16px; height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${b.percentage}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill ${fillClass}" style="width: ${Math.min(100, b.percentage)}%"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <div class="${overBudget ? 'text-danger font-bold' : ''}" style="font-size:0.75rem;">
             ${overBudget ? 'You have gone over the budget' : ''}
          </div>
          <div class="text-right" style="font-size:0.85rem; font-weight: 500;">
            ${b.percentage.toFixed(1)}% Used
          </div>
        </div>
      </article>
    `;
  }).join('') : `<div class="text-secondary" style="grid-column: 1 / -1;">No budgets added yet.</div>`;
}

function populateBudgetSelect() {
  DOM.txnCategorySelect.innerHTML = state.budgets.map(b => 
    `<option value="${escapeHTML(b.name)}">${escapeHTML(b.name)}</option>`
  ).join('');
}

function handleTransactionSubmit(e) {
  e.preventDefault();
  
  const type = document.getElementById('txn-type').value;
  const category = DOM.txnCategorySelect.value;
  const description = document.getElementById('txn-desc').value;
  const senderRecipient = document.getElementById('txn-sender').value;
  const amountStr = document.getElementById('txn-amount').value;
  const date = document.getElementById('txn-date').value;

  const vDesc = validateInput('txn-desc', description, regexRules.description, 'Invalid description');
  const vAmt = validateInput('txn-amount', amountStr, regexRules.amount, 'Invalid amount format');
  const vDate = validateInput('txn-date', date, regexRules.date, 'Invalid date format (YYYY-MM-DD)');
  
  let isValid = vDesc && vAmt && vDate;

  if (type === 'debit') {
    const vCat = validateInput('txn-category', category, regexRules.category, 'Invalid category name');
    isValid = isValid && vCat;
  }

  if (!isValid) return;

  const amount = parseFloat(amountStr);

  const txn = {
    id: 'txn_' + Date.now(),
    type,
    category: type === 'debit' ? category : null,
    description: description.trim(),
    senderRecipient: senderRecipient.trim(),
    amount,
    date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.addTransaction(txn);
  DOM.formTxn.reset();
  
  renderDashboard();
  renderTransactions();
  renderBudgets();
  window.scrollTo(0, 0);
}

function handleBudgetSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('bud-name').value;
  const limit = document.getElementById('bud-limit').value;

  const vName = validateInput('bud-name', name, regexRules.category, 'Letters only for budget name');
  const vLimit = validateInput('bud-limit', limit, regexRules.amount, 'Valid positive number required');

  if (!vName || !vLimit) return;

  const budget = {
    id: 'bud_' + Date.now(),
    name: name.trim(),
    limit: parseFloat(limit),
    image: '',
    createdAt: new Date().toISOString()
  };

  state.addBudget(budget);
  DOM.formBudget.reset();
  
  populateBudgetSelect();
  renderBudgets();
}

function handleBudgetActions(e) {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = btn.getAttribute('data-id');

  if (btn.classList.contains('btn-delete-budget')) {
    if (confirm('Delete this budget? Transactions using it will remain uncategorized.')) {
      state.deleteBudget(id);
      renderDashboard();
      renderBudgets();
      populateBudgetSelect();
    }
  } else if (btn.classList.contains('btn-reallocate')) {
    const newLimit = prompt('Enter new budget limit (RWF):');
    if (newLimit !== null && !isNaN(newLimit) && newLimit > 0) {
      state.reallocateBudget(id, parseFloat(newLimit));
      renderDashboard();
      renderBudgets();
    }
  }
}

function handleDeleteTxn(e) {
  if (e.target.classList.contains('btn-delete')) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const id = e.target.getAttribute('data-id');
      state.deleteTransaction(id);
      renderDashboard();
      renderTransactions();
      renderBudgets();
    }
  }
}
