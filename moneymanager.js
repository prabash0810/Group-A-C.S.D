"use strict";

(function initialiseMoneyManager() {
  const TRANSACTIONS_KEY = "daywise.money.transactions.v1";
  const BUDGET_KEY = "daywise.money.budget.v1";
  const currency = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

  const elements = {
    form: document.getElementById("transactionForm"), description: document.getElementById("transactionDescription"),
    amount: document.getElementById("transactionAmount"), type: document.getElementById("transactionType"),
    category: document.getElementById("transactionCategory"), date: document.getElementById("transactionDate"),
    list: document.getElementById("transactionList"), empty: document.getElementById("emptyState"),
    count: document.getElementById("transactionCount"), message: document.getElementById("formMessage"),
    balance: document.getElementById("balanceTotal"), income: document.getElementById("incomeTotal"),
    expenses: document.getElementById("expenseTotal"), savingsRate: document.getElementById("savingsRate"),
    budgetForm: document.getElementById("budgetForm"), budgetInput: document.getElementById("budgetLimit"),
    budgetSpent: document.getElementById("budgetSpent"), budgetLabel: document.getElementById("budgetLimitLabel"),
    budgetBar: document.getElementById("budgetBar"), budgetProgress: document.querySelector(".budget-progress"),
    budgetStatus: document.getElementById("budgetStatus"), filter: document.getElementById("transactionFilter"),
    search: document.getElementById("transactionSearch"), exportButton: document.getElementById("exportTransactions"),
    clearButton: document.getElementById("clearTransactions"), currentMonth: document.getElementById("currentMonth")
  };

  let transactions = loadTransactions();
  let monthlyBudget = loadBudget();

  function safeParse(value, fallback) {
    try { const parsed = JSON.parse(value); return parsed ?? fallback; }
    catch (error) { console.warn("Money Manager ignored invalid saved data.", error); return fallback; }
  }

  function loadTransactions() {
    const value = safeParse(localStorage.getItem(TRANSACTIONS_KEY), []);
    return Array.isArray(value) ? value.filter(isValidTransaction) : [];
  }

  function isValidTransaction(item) {
    return item && typeof item.id === "string" && ["income", "expense"].includes(item.type) && Number.isFinite(Number(item.amount));
  }

  function loadBudget() {
    const value = Number(localStorage.getItem(BUDGET_KEY));
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function saveTransactions() { localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions)); }
  function formatMoney(value) { return currency.format(Number(value) || 0); }
  function currentMonthKey() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; }

  function getTotals() {
    return transactions.reduce((totals, item) => {
      totals[item.type] += Number(item.amount);
      if (item.type === "expense" && item.date.startsWith(currentMonthKey())) totals.monthExpenses += Number(item.amount);
      return totals;
    }, { income: 0, expense: 0, monthExpenses: 0 });
  }

  function renderSummary() {
    const totals = getTotals();
    const balance = totals.income - totals.expense;
    const rate = totals.income > 0 ? Math.round((balance / totals.income) * 100) : 0;
    elements.balance.textContent = formatMoney(balance);
    elements.income.textContent = formatMoney(totals.income);
    elements.expenses.textContent = formatMoney(totals.expense);
    elements.savingsRate.textContent = `${Math.max(0, rate)}%`;
  }

  function renderBudget() {
    const spent = getTotals().monthExpenses;
    const percentage = monthlyBudget > 0 ? Math.min(100, Math.round((spent / monthlyBudget) * 100)) : 0;
    elements.budgetSpent.textContent = formatMoney(spent);
    elements.budgetLabel.textContent = formatMoney(monthlyBudget);
    elements.budgetBar.style.width = `${percentage}%`;
    elements.budgetBar.classList.toggle("warning", monthlyBudget > 0 && spent > monthlyBudget * .8);
    elements.budgetProgress.setAttribute("aria-valuenow", String(percentage));
    elements.budgetStatus.textContent = monthlyBudget === 0 ? "Set a budget to track monthly spending." : spent > monthlyBudget ? `You are ${formatMoney(spent - monthlyBudget)} over budget.` : `${formatMoney(monthlyBudget - spent)} remaining this month.`;
  }

  function filteredTransactions() {
    const type = elements.filter.value;
    const query = elements.search.value.trim().toLowerCase();
    return transactions.filter((item) => (type === "all" || item.type === type) && (!query || item.description.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)));
  }

  function renderTransactions() {
    const visible = filteredTransactions().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
    elements.list.replaceChildren();
    visible.forEach((item) => {
      const article = document.createElement("article"); article.className = `transaction-item ${item.type}`;
      const marker = document.createElement("span"); marker.className = "transaction-marker"; marker.textContent = item.type === "income" ? "+" : "−";
      const info = document.createElement("div"); info.className = "transaction-info";
      const title = document.createElement("h3"); title.textContent = item.description;
      const meta = document.createElement("p"); meta.textContent = `${item.category} · ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${item.date}T00:00:00`))}`;
      info.append(title, meta);
      const amount = document.createElement("strong"); amount.className = "transaction-amount"; amount.textContent = `${item.type === "income" ? "+" : "−"}${formatMoney(item.amount)}`;
      const remove = document.createElement("button"); remove.className = "delete-transaction"; remove.type = "button"; remove.dataset.id = item.id; remove.setAttribute("aria-label", `Delete ${item.description}`); remove.textContent = "Delete";
      article.append(marker, info, amount, remove); elements.list.appendChild(article);
    });
    elements.empty.hidden = visible.length > 0;
    elements.count.textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  }

  function renderAll() { renderTransactions(); renderSummary(); renderBudget(); }

  elements.form.addEventListener("submit", function (event) {
    event.preventDefault();
    const amount = Number(elements.amount.value);
    if (!elements.description.value.trim() || !Number.isFinite(amount) || amount <= 0 || !elements.date.value) {
      elements.message.textContent = "Please enter a description, positive amount and date."; elements.message.classList.add("error"); return;
    }
    transactions.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, description: elements.description.value.trim(), amount: Math.round(amount * 100) / 100, type: elements.type.value, category: elements.category.value, date: elements.date.value, createdAt: Date.now() });
    saveTransactions(); elements.form.reset(); elements.date.value = new Date().toISOString().slice(0, 10);
    elements.message.textContent = "Transaction added."; elements.message.classList.remove("error"); renderAll(); elements.description.focus();
  });

  elements.list.addEventListener("click", function (event) {
    const button = event.target.closest(".delete-transaction"); if (!button) return;
    transactions = transactions.filter((item) => item.id !== button.dataset.id); saveTransactions(); renderAll();
  });

  elements.budgetForm.addEventListener("submit", function (event) {
    event.preventDefault(); const value = Number(elements.budgetInput.value);
    if (!Number.isFinite(value) || value < 0) { elements.budgetStatus.textContent = "Enter a valid budget amount."; return; }
    monthlyBudget = Math.round(value * 100) / 100; localStorage.setItem(BUDGET_KEY, String(monthlyBudget)); renderBudget();
  });

  elements.filter.addEventListener("change", renderTransactions);
  elements.search.addEventListener("input", renderTransactions);

  elements.exportButton.addEventListener("click", function () {
    if (!transactions.length) { elements.message.textContent = "Add a transaction before exporting."; elements.message.classList.add("error"); return; }
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const rows = [["Date", "Description", "Category", "Type", "Amount"], ...transactions.map((item) => [item.date, item.description, item.category, item.type, item.amount])];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `daywise-money-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  });

  elements.clearButton.addEventListener("click", function () {
    if (!transactions.length || !window.confirm("Delete every Money Manager transaction?")) return;
    transactions = []; saveTransactions(); renderAll(); elements.message.textContent = "All transactions cleared."; elements.message.classList.remove("error");
  });

  elements.date.value = new Date().toISOString().slice(0, 10);
  elements.currentMonth.textContent = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date());
  elements.budgetInput.value = monthlyBudget || "";
  renderAll();
})();
