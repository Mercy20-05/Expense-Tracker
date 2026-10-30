// State management
let expenses = [];
let editingExpenseId = null;

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const formTitle = document.getElementById('formTitle');
const saveBtn = document.getElementById('saveBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const expenseIdInput = document.getElementById('expenseId');
const expenseTitleInput = document.getElementById('expenseTitle');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseCategoryInput = document.getElementById('expenseCategory');
const expenseDateInput = document.getElementById('expenseDate');

const filterCategory = document.getElementById('filterCategory');
const filterStartDate = document.getElementById('filterStartDate');
const filterEndDate = document.getElementById('filterEndDate');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

const expenseListBody = document.getElementById('expenseListBody');
const emptyState = document.getElementById('emptyState');
const totalAmountEl = document.getElementById('totalAmount');
const totalCountEl = document.getElementById('totalCount');
const topCategoryEl = document.getElementById('topCategory');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Set default form date to today
  expenseDateInput.value = new Date().toISOString().split('T')[0];
  loadExpenses();
  setupEventListeners();
  renderApp();
});

// Event Listeners Setup
function setupEventListeners() {
  expenseForm.addEventListener('submit', handleFormSubmit);
  cancelEditBtn.addEventListener('click', resetForm);

  filterCategory.addEventListener('change', renderApp);
  filterStartDate.addEventListener('change', renderApp);
  filterEndDate.addEventListener('change', renderApp);

  clearFiltersBtn.addEventListener('click', () => {
    filterCategory.value = 'ALL';
    filterStartDate.value = '';
    filterEndDate.value = '';
    renderApp();
  });
}

// LocalStorage helpers
function loadExpenses() {
  const storedData = localStorage.getItem('expenses_tracker_data');
  expenses = storedData ? JSON.parse(storedData) : [];
}

function saveExpenses() {
  localStorage.setItem('expenses_tracker_data', JSON.stringify(expenses));
}

// Form Handlers
function handleFormSubmit(e) {
  e.preventDefault();

  const title = expenseTitleInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategoryInput.value;
  const date = expenseDateInput.value;

  if (!title || isNaN(amount) || amount <= 0 || !category || !date) {
    alert('Please fill out all fields with valid information.');
    return;
  }

  if (editingExpenseId) {
    // Edit existing expense
    expenses = expenses.map(item => 
      item.id === editingExpenseId ? { ...item, title, amount, category, date } : item
    );
  } else {
    // Create new expense
    const newExpense = {
      id: Date.now().toString(),
      title,
      amount,
      category,
      date
    };
    expenses.unshift(newExpense);
  }

  saveExpenses();
  resetForm();
  renderApp();
}

function handleEdit(id) {
  const item = expenses.find(exp => exp.id === id);
  if (!item) return;

  editingExpenseId = item.id;
  expenseIdInput.value = item.id;
  expenseTitleInput.value = item.title;
  expenseAmountInput.value = item.amount;
  expenseCategoryInput.value = item.category;
  expenseDateInput.value = item.date;

  formTitle.textContent = 'Edit Expense';
  saveBtn.textContent = 'Update Expense';
  cancelEditBtn.classList.remove('hidden');

  expenseForm.scrollIntoView({ behavior: 'smooth' });
}

function handleDelete(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    expenses = expenses.filter(item => item.id !== id);
    if (editingExpenseId === id) {
      resetForm();
    }
    saveExpenses();
    renderApp();
  }
}

function resetForm() {
  editingExpenseId = null;
  expenseForm.reset();
  expenseIdInput.value = '';
  expenseDateInput.value = new Date().toISOString().split('T')[0];
  formTitle.textContent = 'Add New Expense';
  saveBtn.textContent = 'Save Expense';
  cancelEditBtn.classList.add('hidden');
}

// Filtering Logic
function getFilteredExpenses() {
  const categoryFilter = filterCategory.value;
  const startDate = filterStartDate.value;
  const endDate = filterEndDate.value;

  return expenses.filter(expense => {
    const matchesCategory = categoryFilter === 'ALL' || expense.category === categoryFilter;
    const matchesStart = !startDate || expense.date >= startDate;
    const matchesEnd = !endDate || expense.date <= endDate;
    return matchesCategory && matchesStart && matchesEnd;
  });
}

// Rendering UI
function renderApp() {
  const filteredList = getFilteredExpenses();
  renderTable(filteredList);
  renderSummaries(filteredList);
}

function renderTable(list) {
  expenseListBody.innerHTML = '';

  if (list.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  list.forEach(expense => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${expense.date}</td>
      <td><strong>${escapeHtml(expense.title)}</strong></td>
      <td><span class="category-tag">${escapeHtml(expense.category)}</span></td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-edit" onclick="handleEdit('${expense.id}')">Edit</button>
        <button class="btn btn-sm btn-delete" onclick="handleDelete('${expense.id}')">Delete</button>
      </td>
    `;
    expenseListBody.appendChild(tr);
  });
}

function renderSummaries(list) {
  // 1. Total spending
  const total = list.reduce((sum, item) => sum + item.amount, 0);
  totalAmountEl.textContent = `$${total.toFixed(2)}`;

  // 2. Transaction count
  totalCountEl.textContent = list.length;

  // 3. Top category
  if (list.length === 0) {
    topCategoryEl.textContent = '-';
    return;
  }

  const categoryTotals = list.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const topCat = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  topCategoryEl.textContent = topCat;
}

// Utility: Prevent XSS
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}