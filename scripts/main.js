import { state } from './state.js';
import { initUI } from './ui.js';
import { saveData } from './storage.js';
import { renderCharts } from './charts.js';

let currentData = {};

// Router
function setupRouter() {
  const links = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  function navigateTo(hash) {
    const pageId = hash.replace('#', '') || 'dashboard';
    
    pages.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageId}`);
    const targetLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
    
    if (targetPage) targetPage.classList.add('active');
    if (targetLink) targetLink.classList.add('active');

    // Announce page change
    document.getElementById('aria-live-region').textContent = `Navigated to ${pageId}`;
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('mobile-open');
    }
  }

  window.addEventListener('hashchange', () => navigateTo(window.location.hash));
  
  // Initial load
  navigateTo(window.location.hash);
}

// Sidebar toggle
function setupSidebar() {
  const toggleBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.getElementById('sidebar');

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.toggle('collapsed');
    } else {
      sidebar.classList.toggle('mobile-open');
    }
  });
}

// Theme Toggle
function setupTheme() {
  const toggle = document.getElementById('checkbox');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.replace('light-theme', 'dark-theme');
    toggle.checked = true;
  }

  toggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light');
    }
  });
}

// Report Handlers
function setupReport() {
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const dataStr = JSON.stringify({ transactions: state.transactions, budgets: state.budgets }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "finance_export.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-export-csv').addEventListener('click', () => {
    const headers = ['Date', 'Description', 'Category', 'Sender/Recipient', 'Amount'];
    const rows = state.transactions.map(t => [
      t.date,
      t.description,
      t.category || '',
      t.senderRecipient,
      t.type === 'credit' ? t.amount : -t.amount
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "finance_export.csv");
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('file-import-json').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.transactions && data.budgets) {
          state.transactions = data.transactions;
          state.budgets = data.budgets;
          state.persist();
          location.reload();
        } else {
          document.getElementById('import-json-msg').textContent = "Invalid format: Missing transactions/budgets.";
        }
      } catch (err) {
        document.getElementById('import-json-msg').textContent = "Failed to parse JSON.";
      }
    };
    reader.readAsText(file);
  });
  
  document.getElementById('file-import-csv').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          const lines = ev.target.result.split('\\n');
          let imported = 0;
          for(let i=1; i<lines.length; i++) {
              const line = lines[i].trim();
              if(!line) continue;
              const parts = line.split(',');
              if(parts.length >= 5) {
                  state.addTransaction({
                      id: 'txn_' + Date.now() + i,
                      type: parseFloat(parts[4]) > 0 ? 'credit' : 'debit',
                      date: parts[0],
                      description: parts[1],
                      category: parts[2],
                      senderRecipient: parts[3],
                      amount: Math.abs(parseFloat(parts[4])),
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                  });
                  imported++;
              }
          }
          document.getElementById('import-csv-msg').textContent = `Imported ${imported} transactions.`;
          setTimeout(() => location.reload(), 1000);
      };
      reader.readAsText(file);
  });
}



// Boot app
async function boot() {
  setupTheme();
  setupSidebar();
  setupRouter();
  
  await state.init();
  initUI();
  setupReport();
}

// 🔹 Central update function
function updateData(newData) {
  currentData = newData;
  renderCharts('spending-chart', currentData);
}

// Attempt to solve reloading issue by ensuring charts are rendered after DOM is ready and data is loaded ~ Attempt failed
document.addEventListener('DOMContentLoaded', () => {

  // load data
  const dataFromStorage = JSON.parse(localStorage.getItem('transactions')) || [];

  // Transform data if needed
  const spendingData = calculateSpendingDistribution(dataFromStorage);

  // Use the central updater
  updateData(spendingData);

  const toggleBtn = document.getElementById('theme-toggle');

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    // Re-render using stored state
    renderCharts('spending-chart', currentData);
  });

});

document.addEventListener('DOMContentLoaded', boot);
