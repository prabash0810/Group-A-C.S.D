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

  elements.date.value = new Date().toISOString().slice(0, 10);
  elements.currentMonth.textContent = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date());
  elements.budgetInput.value = monthlyBudget || "";
  renderSummary();
  renderBudget();
})();
