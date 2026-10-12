// app.js — Main app: Router, Dashboard, Settings, PWA, Init

const APP_VERSION = '1.1.0';
const THEME_KEY = 'myday_theme';

const PAGES = [
  { id: 'dashboard', label: 'หน้าแรก', icon: '🏠' },
  { id: 'expenses', label: 'รายจ่าย', icon: '💰' },
  { id: 'habits', label: 'นิสัย', icon: '🌱' },
  { id: 'todos', label: 'To-Do', icon: '✅' },
  { id: 'notes', label: 'บันทึก', icon: '📝' },
  { id: 'settings', label: 'ตั้งค่า', icon: '⚙️' }
];

const RENDERERS = {
  dashboard: () => renderDashboard(),
  expenses: () => renderExpensesPage(),
  habits: () => renderHabitsPage(),
  todos: () => renderTodosPage(),
  notes: () => renderNotesPage(),
  settings: () => renderSettingsPage()
};

// ====== Hash Router ======
function getCurrentRoute() {
  const hash = window.location.hash.slice(1);
  return RENDERERS[hash] ? hash : 'dashboard';
}

function navigate(pageId) {
  window.location.hash = pageId;
}

let lastRoute = null;
let renderedDay = null;

function handleRoute() {
  const route = getCurrentRoute();
  const main = document.getElementById('app');

  document.querySelectorAll('.nav-item').forEach(el => {
    const active = el.dataset.page === route;
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });

  main.innerHTML = RENDERERS[route]();
  renderedDay = todayStr();

  if (route !== lastRoute) {
    window.scrollTo(0, 0);
    lastRoute = route;
  }

  const pageInfo = PAGES.find(p => p.id === route) || PAGES[0];
  document.title = `MyDay — ${pageInfo.label}`;
}

// ====== Dashboard ======
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return '🌙 ยังไม่นอนอีกเหรอ?';
  if (h < 12) return '☀️ อรุณสวัสดิ์!';
  if (h < 17) return '🌤️ สวัสดีตอนบ่าย!';
  if (h < 21) return '🌇 สวัสดีตอนเย็น!';
  return '🌙 ราตรีสวัสดิ์!';
}

function renderDashboard() {
  const todayExpense = Expenses.getSummary('today');
  const monthExpense = Expenses.getSummary('month');
  const todayExpenses = Expenses.getToday();
  const habits = Habits.getAll();
  const habitsDone = habits.filter(h => Habits.isDoneToday(h)).length;
  const todoStats = Todos.getStats();
  const recentNotes = Notes.getAll().slice(0, 3);
  const today = new Date();
  const dateStr = today.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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

  const pendingTodos = Todos.getAll().filter(t => t.status !== 'done').slice(0, 5);
  const todoList = pendingTodos.length === 0
    ? '<p class="dash-card-sub">ไม่มีงานค้าง 🎉</p>'
    : pendingTodos.map(t => {
        const p = getPriorityInfo(t.priority);
        return `<div class="todo-mini"><span class="todo-mini-dot" style="background:${p.color}"></span><span>${escapeHtml(t.title)}</span></div>`;
      }).join('');

  const notesList = recentNotes.length === 0
    ? '<p class="dash-card-sub">ยังไม่มีบันทึก</p>'
    : recentNotes.map(n => `<div class="note-mini">${escapeHtml(n.content.slice(0, 100))}${n.content.length > 100 ? '...' : ''}</div>`).join('');

  const todayExpensesList = todayExpenses.length === 0
    ? '<p class="dash-card-sub">ยังไม่มีรายจ่ายวันนี้</p>'
    : todayExpenses.slice(0, 4).map(e => {
        const cat = getCategoryById(e.categoryId);
        return `<div class="habit-mini"><span>${cat.icon}</span><span>${escapeHtml(e.note) || cat.label}</span><span class="mini-amount">${formatMoney(e.amount)}฿</span></div>`;
      }).join('');

  const habitPct = habits.length ? Math.round(habitsDone / habits.length * 100) : 0;

  return `
    <div class="page-header">
      <h1>${getGreeting()}</h1>
      <p class="subtitle">${dateStr}</p>
    </div>

    <div class="dashboard-grid">
      <a class="dash-card" href="#expenses">
        <div class="dash-card-header">
          <span class="dash-card-title">💰 จ่ายวันนี้</span>
          <span class="dash-card-icon">💸</span>
        </div>
        <div class="dash-card-value">${formatMoney(todayExpense)} ฿</div>
        <div class="dash-card-sub">เดือนนี้รวม ${formatMoney(monthExpense)} ฿</div>
        <div class="habit-mini-list">${todayExpensesList}</div>
      </a>

      <a class="dash-card" href="#habits">
        <div class="dash-card-header">
          <span class="dash-card-title">🌱 นิสัยวันนี้</span>
          <span class="dash-card-icon">🌿</span>
        </div>
        <div class="dash-card-value">${habitsDone}/${habits.length}</div>
        <div class="progress"><div class="progress-fill" style="width:${habitPct}%"></div></div>
        <div class="dash-card-sub">${habitsDone === habits.length && habits.length > 0 ? '🎉 ครบทุกข้อ!' : 'ทำต่อไป!'}</div>
        <div class="habit-mini-list">${habitList}</div>
      </a>

      <a class="dash-card" href="#todos">
        <div class="dash-card-header">
          <span class="dash-card-title">✅ งานค้าง</span>
          <span class="dash-card-icon">📋</span>
        </div>
        <div class="dash-card-value">${todoStats.todo + todoStats.doing}</div>
        <div class="dash-card-sub">เสร็จแล้ว ${todoStats.done} รายการ</div>
        <div class="todo-mini-list">${todoList}</div>
      </a>

      <a class="dash-card" href="#notes">
        <div class="dash-card-header">
          <span class="dash-card-title">📝 บันทึกล่าสุด</span>
          <span class="dash-card-icon">✍️</span>
        </div>
        ${notesList}
      </a>
    </div>
  `;
}

// ====== Theme ======
function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'auto';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1e1e2e' : '#6c5ce7');
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  refreshPage();
}

// ====== PWA Install ======
let deferredInstallPrompt = null;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

async function handleInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  if (outcome === 'accepted') showToast('ติดตั้ง MyDay แล้ว 🎉');
  refreshPage();
}

function renderInstallCard() {
  if (isStandalone()) {
    return '<p class="settings-note">✅ กำลังใช้งานแบบแอปที่ติดตั้งแล้ว</p>';
  }
  if (deferredInstallPrompt) {
    return `
      <p class="settings-note">ติดตั้ง MyDay ลงหน้าจอหลัก ใช้งานได้แม้ไม่มีอินเทอร์เน็ต</p>
      <button class="btn btn-primary btn-full" onclick="handleInstall()">📲 ติดตั้งแอป</button>
    `;
  }
  if (location.protocol === 'file:') {
    return '<p class="settings-note">⚠️ เปิดผ่านไฟล์โดยตรง — ใช้งานได้ปกติ แต่จะติดตั้งเป็นแอป/ใช้ออฟไลน์ไม่ได้ ให้เปิดผ่านเว็บ (เช่น GitHub Pages หรือ local server) แทน</p>';
  }
  return `
    <p class="settings-note">
      📱 <b>iPhone/iPad (Safari):</b> กดปุ่มแชร์ ⬆️ → "เพิ่มไปยังหน้าจอโฮม"<br>
      🤖 <b>Android (Chrome):</b> เมนู ⋮ → "ติดตั้งแอป"<br>
      💻 <b>Chrome/Edge บนคอม:</b> กดไอคอนติดตั้งที่แถบที่อยู่
    </p>
  `;
}

// ====== Settings Page ======
function renderSettingsPage() {
  const data = Store.loadData();
  const createdDate = data.meta.createdAt
    ? new Date(data.meta.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'ไม่ทราบ';
  const theme = getTheme();
  const themeBtn = (id, label) =>
    `<button class="seg-btn ${theme === id ? 'active' : ''}" onclick="setTheme('${id}')" aria-pressed="${theme === id}">${label}</button>`;
  const row = (icon, label, value) =>
    `<div class="habit-mini"><span>${icon}</span><span>${label}</span><span class="mini-amount">${value}</span></div>`;

  return `
    <div class="page-header">
      <h1>⚙️ ตั้งค่า</h1>
      <p class="subtitle">จัดการข้อมูลและตัวเลือก</p>
    </div>

    <div class="card">
      <h3>🎨 ธีม</h3>
      <div class="segmented">
        ${themeBtn('auto', '🖥️ ตามระบบ')}
        ${themeBtn('light', '☀️ สว่าง')}
        ${themeBtn('dark', '🌙 มืด')}
      </div>
    </div>

    <div class="card">
      <h3>📲 ติดตั้งเป็นแอป</h3>
      ${renderInstallCard()}
    </div>

    <div class="card">
      <h3>📊 สถิติการใช้งาน</h3>
      <div class="habit-mini-list">
        ${row('💰', 'รายจ่ายทั้งหมด', `${data.expenses.length} รายการ`)}
        ${row('🌱', 'นิสัยที่ติดตาม', `${data.habits.length} รายการ`)}
        ${row('✅', 'To-Do ทั้งหมด', `${data.todos.length} รายการ`)}
        ${row('📝', 'บันทึกทั้งหมด', `${data.notes.length} รายการ`)}
        ${row('📅', 'ใช้งานตั้งแต่', createdDate)}
      </div>
    </div>

    <div class="card">
      <h3>💾 สำรองข้อมูล</h3>
      <p class="settings-note">ข้อมูลเก็บอยู่ในเบราว์เซอร์เครื่องนี้เท่านั้น แนะนำให้ Export เก็บไว้เป็นระยะ หรือใช้ย้ายข้อมูลไปเครื่องอื่น</p>
      <div class="settings-actions">
        <button class="btn btn-primary" onclick="handleExport()">⬇️ Export ข้อมูล (JSON)</button>
        <label class="btn btn-outline" style="text-align:center;cursor:pointer">
          ⬆️ Import ข้อมูล (JSON)
          <input type="file" accept=".json,application/json" style="display:none" onchange="handleImport(event)">
        </label>
      </div>
    </div>

    <div class="card">
      <h3>🗑️ ล้างข้อมูล</h3>
      <p class="settings-note" style="color:var(--danger)">⚠️ จะลบข้อมูลทั้งหมด ไม่สามารถกู้คืนได้!</p>
      <button class="btn btn-danger-solid" onclick="handleClearData()">ล้างข้อมูลทั้งหมด</button>
    </div>

    <div class="card" style="text-align:center">
      <p class="settings-note">MyDay v${APP_VERSION} — สร้างด้วย ❤️</p>
      <p class="settings-note" style="font-size:11px">ข้อมูลเก็บในเครื่องของคุณเท่านั้น ไม่มีการส่งขึ้นเซิร์ฟเวอร์</p>
    </div>
  `;
}

function handleExport() {
  const json = Store.exportData();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `myday-backup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Export สำเร็จ ✅');
}

function handleImport(event) {
  const input = event.target;
  const file = input.files[0];
  if (!file) return;
  if (!confirm('Import จะเขียนทับข้อมูลปัจจุบันทั้งหมด ต้องการดำเนินการต่อหรือไม่?')) {
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    if (Store.importData(e.target.result)) {
      showToast('Import สำเร็จ ✅');
      refreshPage();
    } else {
      showToast('Import ไม่สำเร็จ ❌ ไฟล์ไม่ถูกต้อง');
    }
    input.value = '';
  };
  reader.readAsText(file);
}

function handleClearData() {
  if (confirm('ต้องการล้างข้อมูลทั้งหมดจริงหรือไม่? ไม่สามารถกู้คืนได้!')) {
    Store.clearAllData();
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
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function refreshPage() {
  handleRoute();
}

// ====== Build Navigation ======
function buildNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = `
    <div class="nav-brand">🗓️ MyDay</div>
    ${PAGES.map(p =>
      `<a class="nav-item" data-page="${p.id}" href="#${p.id}">
        <span class="nav-icon" aria-hidden="true">${p.icon}</span>
        <span>${p.label}</span>
      </a>`
    ).join('')}
  `;
}

// ====== PWA: Service Worker ======
function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          showToast('มีเวอร์ชันใหม่ — ปิดแล้วเปิดแอปใหม่เพื่ออัปเดต');
        }
      });
    });
  }).catch(err => console.warn('ลงทะเบียน Service Worker ไม่สำเร็จ:', err));

  // ขอให้เบราว์เซอร์ไม่ลบข้อมูลอัตโนมัติ
  navigator.storage?.persist?.().catch(() => {});
}

function isEditing() {
  const el = document.activeElement;
  return el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) && el.value;
}

// ====== Init ======
function init() {
  applyTheme(getTheme());
  buildNav();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);

  // เปลี่ยนวันระหว่างเปิดแอปค้างไว้ → render ใหม่
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && renderedDay !== todayStr()) refreshPage();
  });
  setInterval(() => {
    if (renderedDay !== todayStr() && !isEditing()) refreshPage();
  }, 60 * 1000);

  // ซิงก์เมื่อแก้ข้อมูลจากอีกแท็บ
  window.addEventListener('storage', (e) => {
    if (e.key === Store.STORAGE_KEY && !isEditing()) refreshPage();
    if (e.key === THEME_KEY) applyTheme(getTheme());
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => applyTheme(getTheme()));

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (getCurrentRoute() === 'settings') refreshPage();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (getCurrentRoute() === 'settings') refreshPage();
  });

  registerServiceWorker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.navigate = navigate;
window.refreshPage = refreshPage;
window.showToast = showToast;
window.handleExport = handleExport;
window.handleImport = handleImport;
window.handleClearData = handleClearData;
window.handleInstall = handleInstall;
window.setTheme = setTheme;
window.renderSettingsPage = renderSettingsPage;
