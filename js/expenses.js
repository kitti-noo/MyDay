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

function getCategoryById(id) {
  return EXPENSE_CATEGORIES.find(c => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

const Expenses = {
  /**
   * เพิ่มรายจ่ายใหม่
   */
  add(amount, categoryId, note = '', date = null) {
    const data = Storage.loadData();
    const expense = {
      id: Storage.genId(),
      amount: parseFloat(amount),
      categoryId,
      note: note.trim(),
      date: date || new Date().toISOString().slice(0, 10)
    };
    data.expenses.push(expense);
    Storage.saveData(data);
    return expense;
  },

  /**
   * ลบรายจ่าย
   */
  remove(id) {
    const data = Storage.loadData();
    data.expenses = data.expenses.filter(e => e.id !== id);
    Storage.saveData(data);
  },

  /**
   * ดึงรายจ่ายทั้งหมด (เรียงจากใหม่ไปเก่า)
   */
  getAll() {
    const data = Storage.loadData();
    return [...data.expenses].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },

  /**
   * สรุปยอดรวมตามช่วงเวลา
   */
  getSummary(period = 'month') {
    const all = this.getAll();
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = todayStr.slice(0, 7);

    return all.filter(e => {
      if (period === 'today') return e.date === todayStr;
      if (period === 'month') return e.date.startsWith(monthStr);
      return true;
    }).reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * สรุปตามหมวดหมู่ (เดือนนี้)
   */
  getByCategory() {
    const all = this.getAll();
    const monthStr = new Date().toISOString().slice(0, 7);
    const filtered = all.filter(e => e.date.startsWith(monthStr));
    const byCat = {};
    filtered.forEach(e => {
      if (!byCat[e.categoryId]) byCat[e.categoryId] = 0;
      byCat[e.categoryId] += e.amount;
    });
    return byCat;
  },

  /**
   * ดึงรายจ่ายวันนี้
   */
  getToday() {
    const todayStr = new Date().toISOString().slice(0, 10);
    return this.getAll().filter(e => e.date === todayStr);
  }
};

// สร้าง UI สำหรับหน้ารายจ่าย
function renderExpensesPage() {
  const all = Expenses.getAll();
  const todayTotal = Expenses.getSummary('today');
  const monthTotal = Expenses.getSummary('month');
  const byCategory = Expenses.getByCategory();
  const monthStr = new Date().toISOString().slice(0, 7);

  // สร้าง HTML สรุปหมวดหมู่
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
          <span class="cat-amount">${amount.toLocaleString()} ฿</span>
        </div>
      `;
    }).join('');

  // สร้าง HTML รายการรายจ่าย
  const list = all.length === 0
    ? '<p class="empty-state">ยังไม่มีรายจ่าย 📭 ลองเพิ่มรายการดูสิ!</p>'
    : all.map(e => {
        const cat = getCategoryById(e.categoryId);
        return `
          <div class="expense-item" data-id="${e.id}">
            <div class="expense-icon" style="background:${cat.color}22;color:${cat.color}">${cat.icon}</div>
            <div class="expense-info">
              <div class="expense-cat">${cat.label}</div>
              <div class="expense-note">${e.note || '—'}</div>
              <div class="expense-date">${formatDate(e.date)}</div>
            </div>
            <div class="expense-amount">${e.amount.toLocaleString()} ฿</div>
            <button class="btn-icon btn-danger" onclick="Expenses.remove('${e.id}'); refreshPage()" title="ลบ">✕</button>
          </div>
        `;
      }).join('');

  // สร้าง dropdown หมวดหมู่
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
        <div class="summary-value">${todayTotal.toLocaleString()} ฿</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">เดือนนี้</div>
        <div class="summary-value">${monthTotal.toLocaleString()} ฿</div>
      </div>
    </div>

    <div class="card">
      <h3>➕ เพิ่มรายจ่าย</h3>
      <form id="expense-form" onsubmit="return handleAddExpense(event)">
        <div class="form-row">
          <input type="number" id="exp-amount" placeholder="จำนวนเงิน (฿)" required min="1" step="0.01">
          <select id="exp-category" required>
            ${catOptions}
          </select>
        </div>
        <div class="form-row">
          <input type="text" id="exp-note" placeholder="หมายเหตุ (ไม่จำเป็น)">
          <input type="date" id="exp-date" value="${new Date().toISOString().slice(0,10)}">
        </div>
        <button type="submit" class="btn btn-primary btn-full">เพิ่มรายจ่าย</button>
      </form>
    </div>

    ${monthTotal > 0 ? `
    <div class="card">
      <h3>📊 สัดส่วนหมวดหมู่ (เดือนนี้)</h3>
      <div class="cat-bars">${catBars}</div>
    </div>
    ` : ''}

    <div class="card">
      <h3>📋 รายการทั้งหมด (${all.length})</h3>
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
  Expenses.add(amount, category, note, date);
  refreshPage();
  return false;
}

// helper
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor((today - d) / 86400000);
  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'เมื่อวาน';
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ทำให้เรียกใช้ได้ทั่วโลก
window.Expenses = Expenses;
window.renderExpensesPage = renderExpensesPage;
window.handleAddExpense = handleAddExpense;
window.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
window.formatDate = formatDate;
