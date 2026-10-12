// expenses.js — ติดตามรายจ่าย

const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'อาหาร', icon: '🍜', color: '#ff6b6b' },
  { id: 'transport', label: 'การเดินทาง', icon: '🚗', color: '#4ecdc4' },
  { id: 'shopping', label: 'ช้อปปิ้ง', icon: '🛍️', color: '#45b7d1' },
  { id: 'bill', label: 'บิล/ค่าใช้จ่าย', icon: '🧾', color: '#f9ca24' },
  { id: 'health', label: 'สุขภาพ', icon: '💊', color: '#6c5ce7' },
  { id: 'entertain', label: 'บันเทิง', icon: '🎮', color: '#e056fd' },
  { id: 'other', label: 'อื่นๆ', icon: '📦', color: '#95a5a6' }
];

const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

// เดือนที่กำลังดูในหน้ารายจ่าย (YYYY-MM)
let expenseViewMonth = null;

function getCategoryById(id) {
  return EXPENSE_CATEGORIES.find(c => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

const Expenses = {
  add(amount, categoryId, note = '', date = null) {
    const value = parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) return null;
    const data = Store.loadData();
    const expense = {
      id: Store.genId(),
      amount: Math.round(value * 100) / 100,
      categoryId,
      note: note.trim(),
      date: date || todayStr()
    };
    data.expenses.push(expense);
    Store.saveData(data);
    return expense;
  },

  remove(id) {
    const data = Store.loadData();
    data.expenses = data.expenses.filter(e => e.id !== id);
    Store.saveData(data);
  },

  /**
   * ดึงรายจ่ายทั้งหมด (เรียงจากใหม่ไปเก่า)
   */
  getAll() {
    const data = Store.loadData();
    return [...data.expenses].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },

  getByMonth(monthStr) {
    return this.getAll().filter(e => e.date.startsWith(monthStr));
  },

  /**
   * สรุปยอดรวมตามช่วงเวลา: 'today' | 'month' | 'all' | 'YYYY-MM'
   */
  getSummary(period = 'month') {
    const today = todayStr();
    const month = /^\d{4}-\d{2}$/.test(period) ? period : today.slice(0, 7);
    return this.getAll().filter(e => {
      if (period === 'today') return e.date === today;
      if (period === 'all') return true;
      return e.date.startsWith(month);
    }).reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * สรุปตามหมวดหมู่ของเดือนที่ระบุ (default = เดือนนี้)
   */
  getByCategory(monthStr = todayStr().slice(0, 7)) {
    const byCat = {};
    this.getByMonth(monthStr).forEach(e => {
      byCat[e.categoryId] = (byCat[e.categoryId] || 0) + e.amount;
    });
    return byCat;
  },

  getToday() {
    const today = todayStr();
    return this.getAll().filter(e => e.date === today);
  }
};

function shiftMonth(monthStr, delta) {
  const [y, m] = monthStr.split('-').map(Number);
  return toDateStr(new Date(y, m - 1 + delta, 1)).slice(0, 7);
}

function formatMonth(monthStr) {
  const [y, m] = monthStr.split('-').map(Number);
  return `${THAI_MONTHS[m - 1]} ${y + 543}`;
}

function changeExpenseMonth(delta) {
  expenseViewMonth = delta === 0 ? todayStr().slice(0, 7) : shiftMonth(expenseViewMonth, delta);
  refreshPage();
}

function renderExpensesPage() {
  const currentMonth = todayStr().slice(0, 7);
  if (!expenseViewMonth) expenseViewMonth = currentMonth;
  const viewMonth = expenseViewMonth;
  const isCurrentMonth = viewMonth === currentMonth;

  const monthItems = Expenses.getByMonth(viewMonth);
  const todayTotal = Expenses.getSummary('today');
  const monthTotal = Expenses.getSummary(viewMonth);
  const byCategory = Expenses.getByCategory(viewMonth);

  const catBars = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([catId, amount]) => {
      const cat = getCategoryById(catId);
      const pct = monthTotal > 0 ? (amount / monthTotal * 100) : 0;
      return `
        <div class="cat-bar">
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-label">${cat.label}</span>
          <div class="cat-track">
            <div class="cat-fill" style="width:${pct}%;background:${cat.color}"></div>
          </div>
          <span class="cat-amount">${formatMoney(amount)} ฿</span>
        </div>
      `;
    }).join('');

  const list = monthItems.length === 0
    ? `<p class="empty-state">ยังไม่มีรายจ่ายใน${isCurrentMonth ? 'เดือนนี้' : ` ${formatMonth(viewMonth)}`} 📭</p>`
    : monthItems.map(e => {
        const cat = getCategoryById(e.categoryId);
        return `
          <div class="expense-item" data-id="${e.id}">
            <div class="expense-icon" style="background:${cat.color}22;color:${cat.color}">${cat.icon}</div>
            <div class="expense-info">
              <div class="expense-cat">${cat.label}</div>
              <div class="expense-note">${escapeHtml(e.note) || '—'}</div>
              <div class="expense-date">${formatDate(e.date)}</div>
            </div>
            <div class="expense-amount">${formatMoney(e.amount)} ฿</div>
            <button class="btn-icon btn-danger" onclick="handleRemoveExpense('${e.id}')" title="ลบ" aria-label="ลบรายจ่าย">✕</button>
          </div>
        `;
      }).join('');

  const catOptions = EXPENSE_CATEGORIES.map(c =>
    `<option value="${c.id}">${c.icon} ${c.label}</option>`
  ).join('');

  return `
    <div class="page-header">
      <h1>💰 รายจ่าย</h1>
      <p class="subtitle">ติดตามการใช้จ่ายรายวัน</p>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-label">วันนี้</div>
        <div class="summary-value">${formatMoney(todayTotal)} ฿</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">${isCurrentMonth ? 'เดือนนี้' : formatMonth(viewMonth)}</div>
        <div class="summary-value">${formatMoney(monthTotal)} ฿</div>
      </div>
    </div>

    <div class="card">
      <h3>➕ เพิ่มรายจ่าย</h3>
      <form id="expense-form" onsubmit="return handleAddExpense(event)">
        <div class="form-row">
          <input type="number" id="exp-amount" placeholder="จำนวนเงิน (฿)" required min="0.01" step="0.01" inputmode="decimal" aria-label="จำนวนเงิน">
          <select id="exp-category" required aria-label="หมวดหมู่">
            ${catOptions}
          </select>
        </div>
        <div class="form-row">
          <input type="text" id="exp-note" placeholder="หมายเหตุ (ไม่จำเป็น)" maxlength="200" aria-label="หมายเหตุ">
          <input type="date" id="exp-date" value="${todayStr()}" max="${todayStr()}" required aria-label="วันที่">
        </div>
        <button type="submit" class="btn btn-primary btn-full">เพิ่มรายจ่าย</button>
      </form>
    </div>

    <div class="month-nav">
      <button class="btn-mini" onclick="changeExpenseMonth(-1)" aria-label="เดือนก่อนหน้า">◀</button>
      <span class="month-nav-label">${formatMonth(viewMonth)}</span>
      <button class="btn-mini" onclick="changeExpenseMonth(1)" ${isCurrentMonth ? 'disabled' : ''} aria-label="เดือนถัดไป">▶</button>
      ${isCurrentMonth ? '' : '<button class="btn-mini" onclick="changeExpenseMonth(0)">เดือนนี้</button>'}
    </div>

    ${monthTotal > 0 ? `
    <div class="card">
      <h3>📊 สัดส่วนหมวดหมู่</h3>
      <div class="cat-bars">${catBars}</div>
    </div>
    ` : ''}

    <div class="card">
      <h3>📋 รายการ (${monthItems.length})</h3>
      <div class="expense-list">${list}</div>
    </div>
  `;
}

function handleAddExpense(e) {
  e.preventDefault();
  const amount = document.getElementById('exp-amount').value;
  const category = document.getElementById('exp-category').value;
  const note = document.getElementById('exp-note').value;
  const date = document.getElementById('exp-date').value;
  const added = Expenses.add(amount, category, note, date);
  if (!added) {
    showToast('กรุณาใส่จำนวนเงินที่ถูกต้อง');
    return false;
  }
  expenseViewMonth = added.date.slice(0, 7);
  refreshPage();
  showToast(`เพิ่มรายจ่าย ${formatMoney(added.amount)} ฿ แล้ว ✅`);
  return false;
}

function handleRemoveExpense(id) {
  if (!confirm('ลบรายจ่ายนี้?')) return;
  Expenses.remove(id);
  refreshPage();
  showToast('ลบรายจ่ายแล้ว');
}

function formatDate(dateStr) {
  const d = parseDateStr(dateStr);
  const today = parseDateStr(todayStr());
  const diffDays = Math.round((today - d) / 86400000);
  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'เมื่อวาน';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

window.Expenses = Expenses;
window.renderExpensesPage = renderExpensesPage;
window.handleAddExpense = handleAddExpense;
window.handleRemoveExpense = handleRemoveExpense;
window.changeExpenseMonth = changeExpenseMonth;
window.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
window.getCategoryById = getCategoryById;
window.formatDate = formatDate;
