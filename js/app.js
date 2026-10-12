// app.js — Main app: Router, Dashboard, Settings, Init

const PAGES = [
  { id: 'dashboard', label: 'หน้าแรก', icon: '🏠' },
  { id: 'expenses', label: 'รายจ่าย', icon: '💰' },
  { id: 'habits', label: 'นิสัย', icon: '🌱' },
  { id: 'todos', label: 'ทำติว', icon: '✅' },
  { id: 'notes', label: 'บันทึก', icon: '📝' },
  { id: 'settings', label: 'ตั้งค่า', icon: '⚙️' }
];

// ====== Hash Router ======
function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  return hash;
}

function navigate(pageId) {
  window.location.hash = pageId;
}

function handleRoute() {
  const route = getCurrentRoute();
  const main = document.getElementById('app');

  // อัปเดต active nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === route);
  });

  switch (route) {
    case 'dashboard':
      main.innerHTML = renderDashboard();
      break;
    case 'expenses':
      main.innerHTML = renderExpensesPage();
      break;
    case 'habits':
      main.innerHTML = renderHabitsPage();
      break;
    case 'todos':
      main.innerHTML = renderTodosPage();
      break;
    case 'notes':
      main.innerHTML = renderNotesPage();
      break;
    case 'settings':
      main.innerHTML = renderSettingsPage();
      break;
    default:
      main.innerHTML = renderDashboard();
  }

  // อัปเดตชื่อหน้า (document title)
  const pageInfo = PAGES.find(p => p.id === route) || PAGES[0];
  document.title = `MyDay — ${pageInfo.label}`;
}

// ====== Dashboard ======
function renderDashboard() {
  const todayExpense = Expenses.getSummary('today');
  const monthExpense = Expenses.getSummary('month');
  const todayExpenses = Expenses.getToday();
  const habits = Habits.getAll();
  const habitsDone = habits.filter(h => Habits.isDoneToday(h)).length;
  const todoStats = Todos.getStats();
  const recentNotes = Notes.getAll().slice(0, 3);
  const today = new Date();
  const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const dateStr = `วัน${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear() + 543}`;

  // Habit mini list
  const habitList = habits.length === 0
    ? '<p class="dash-card-sub">ยังไม่มีนิสัยที่ติดตาม</p>'
    : habits.map(h => {
        const done = Habits.isDoneToday(h);
        return `
          <div class="habit-mini ${done ? 'habit-mini-done' : 'habit-mini-pending'}">
            <span>${done ? '✅' : '⬜'}</span>
            <span>${h.icon} ${escapeHtml(h.name)}</span>
          </div>
        `;
      }).join('');

  // Today's todos (top 5)
  const pendingTodos = Todos.getAll().filter(t => t.status !== 'done').slice(0, 5);
  const todoList = pendingTodos.length === 0
    ? '<p class="dash-card-sub">ไม่มีงานค้าง 🎉</p>'
    : pendingTodos.map(t => {
        const p = getPriorityInfo(t.priority);
        return `<div class="todo-mini"><span class="todo-mini-dot" style="background:${p.color}"></span><span>${escapeHtml(t.title)}</span></div>`;
      }).join('');

  // Recent notes
  const notesList = recentNotes.length === 0
    ? '<p class="dash-card-sub">ยังไม่มีบันทึก</p>'
    : recentNotes.map(n => `<div class="note-mini">${escapeHtml(n.content.slice(0, 100))}${n.content.length > 100 ? '...' : ''}</div>`).join('');

  // Today's expenses
  const todayExpensesList = todayExpenses.length === 0
    ? '<p class="dash-card-sub">ยังไม่มีรายจ่ายวันนี้</p>'
    : todayExpenses.slice(0, 4).map(e => {
        const cat = getCategoryById(e.categoryId);
        return `<div class="habit-mini"><span>${cat.icon}</span><span>${cat.label}</span><span style="margin-left:auto;font-weight:600">${e.amount.toLocaleString()}฿</span></div>`;
      }).join('');

  return `
    <div class="page-header">
      <h1>👋 สวัสดี!</h1>
      <p class="subtitle">${dateStr}</p>
    </div>

    <div class="dashboard-grid">
      <div class="dash-card" onclick="navigate('expenses')">
        <div class="dash-card-header">
          <span class="dash-card-title">💰 จ่ายวันนี้</span>
          <span class="dash-card-icon">💸</span>
        </div>
        <div class="dash-card-value">${todayExpense.toLocaleString()} ฿</div>
        <div class="dash-card-sub">เดือนนี้รวม ${monthExpense.toLocaleString()} ฿</div>
        ${todayExpensesList}
      </div>

      <div class="dash-card" onclick="navigate('habits')">
        <div class="dash-card-header">
          <span class="dash-card-title">🌱 นิสัยวันนี้</span>
          <span class="dash-card-icon">🌿</span>
        </div>
        <div class="dash-card-value">${habitsDone}/${habits.length}</div>
        <div class="dash-card-sub">${habitsDone === habits.length && habits.length > 0 ? '🎉 ครบทุกข้อ!' : 'ทำต่อไป!'}</div>
        <div class="habit-mini-list">${habitList}</div>
      </div>

      <div class="dash-card" onclick="navigate('todos')">
        <div class="dash-card-header">
          <span class="dash-card-title">✅ งานค้าง</span>
          <span class="dash-card-icon">📋</span>
        </div>
        <div class="dash-card-value">${todoStats.todo + todoStats.doing}</div>
        <div class="dash-card-sub">เสร็จแล้ว ${todoStats.done} รายการ</div>
        <div class="todo-mini-list">${todoList}</div>
      </div>

      <div class="dash-card" onclick="navigate('notes')">
        <div class="dash-card-header">
          <span class="dash-card-title">📝 บันทึกล่าสุด</span>
          <span class="dash-card-icon">✍️</span>
        </div>
        ${notesList}
      </div>
    </div>
  `;
}

// ====== Settings Page ======
function renderSettingsPage() {
  const data = Storage.loadData();
  const createdDate = data.meta.createdAt ? new Date(data.meta.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : 'ไม่ทราบ';
  const totalExpenses = data.expenses.length;
  const totalHabits = data.habits.length;
  const totalTodos = data.todos.length;
  const totalNotes = data.notes.length;

  return `
    <div class="page-header">
      <h1>⚙️ ตั้งค่า</h1>
      <p class="subtitle">จัดการข้อมูลและตัวเลือก</p>
    </div>

    <div class="card">
      <h3>📊 สถิติการใช้งาน</h3>
      <div class="habit-mini-list">
        <div class="habit-mini"><span>💰</span><span>รายจ่ายทั้งหมด</span><span style="margin-left:auto;font-weight:600">${totalExpenses} รายการ</span></div>
        <div class="habit-mini"><span>🌱</span><span>นิสัยที่ติดตาม</span><span style="margin-left:auto;font-weight:600">${totalHabits} รายการ</span></div>
        <div class="habit-mini"><span>✅</span><span>To-Do ทั้งหมด</span><span style="margin-left:auto;font-weight:600">${totalTodos} รายการ</span></div>
        <div class="habit-mini"><span>📝</span><span>บันทึกทั้งหมด</span><span style="margin-left:auto;font-weight:600">${totalNotes} รายการ</span></div>
        <div class="habit-mini"><span>📅</span><span>ใช้งานตั้งแต่</span><span style="margin-left:auto;font-weight:600">${createdDate}</span></div>
      </div>
    </div>

    <div class="card">
      <h3>💾 สำรองข้อมูล</h3>
      <div class="settings-actions">
        <button class="btn btn-primary" onclick="handleExport()">⬇️ Export ข้อมูล (JSON)</button>
        <label class="btn btn-primary" style="text-align:center;cursor:pointer">
          ⬆️ Import ข้อมูล (JSON)
          <input type="file" accept=".json" style="display:none" onchange="handleImport(event)">
        </label>
      </div>
    </div>

    <div class="card">
      <h3>🗑️ ล้างข้อมูล</h3>
      <p style="color:var(--danger);font-size:13px;margin-bottom:12px">⚠️ จะลบข้อมูลทั้งหมด ไม่สามารถกู้คืนได้!</p>
      <button class="btn" style="background:var(--danger);color:#fff" onclick="handleClearData()">ล้างข้อมูลทั้งหมด</button>
    </div>

    <div class="card" style="text-align:center">
      <p style="font-size:13px;color:var(--text-light)">MyDay v1.0 — สร้างด้วย ❤️</p>
      <p style="font-size:11px;color:var(--text-light);margin-top:4px">ข้อมูลเก็บในเครื่องของคุณเท่านั้น</p>
    </div>
  `;
}

function handleExport() {
  const json = Storage.exportData();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `myday-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export สำเร็จ ✅');
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const success = Storage.importData(e.target.result);
    if (success) {
      showToast('Import สำเร็จ ✅');
      refreshPage();
    } else {
      showToast('Import ไม่สำเร็จ ❌ ไฟล์ไม่ถูกต้อง');
    }
  };
  reader.readAsText(file);
}

function handleClearData() {
  if (confirm('ต้องการล้างข้อมูลทั้งหมดจริงหรือไม่? ไม่สามารถกู้คืนได้!')) {
    Storage.clearAllData();
    showToast('ล้างข้อมูลแล้ว');
    refreshPage();
  }
}

// ====== Toast ======
let toastTimer = null;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ====== Refresh current page ======
function refreshPage() {
  handleRoute();
}

// ====== Build Navigation ======
function buildNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = PAGES.map(p =>
    `<a class="nav-item" data-page="${p.id}" href="#${p.id}">
      <span class="nav-icon">${p.icon}</span>
      <span>${p.label}</span>
    </a>`
  ).join('');
}

// ====== Init ======
function init() {
  buildNav();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
}

// เริ่มเมื่อ DOM พร้อม
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export globals
window.navigate = navigate;
window.refreshPage = refreshPage;
window.showToast = showToast;
window.handleExport = handleExport;
window.handleImport = handleImport;
window.handleClearData = handleClearData;
window.renderSettingsPage = renderSettingsPage;
window.getPriorityInfo = (typeof getPriorityInfo !== 'undefined') ? getPriorityInfo : null;
