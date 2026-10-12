// storage.js — จัดการ localStorage (Generic CRUD) + ฟังก์ชันช่วยที่ใช้ร่วมกัน
// เก็บข้อมูลทั้งหมดใน key เดียวชื่อ "myday_data"

const STORAGE_KEY = 'myday_data';

function createDefaultData() {
  const now = new Date().toISOString();
  return {
    expenses: [],
    habits: [],
    todos: [],
    notes: [],
    meta: { createdAt: now, lastOpened: now }
  };
}

function normalizeData(parsed) {
  const base = createDefaultData();
  const arr = v => (Array.isArray(v) ? v : []);
  return {
    expenses: arr(parsed.expenses),
    habits: arr(parsed.habits).map(h => ({ ...h, log: h.log && typeof h.log === 'object' ? h.log : {} })),
    todos: arr(parsed.todos),
    notes: arr(parsed.notes),
    meta: parsed.meta && typeof parsed.meta === 'object' ? { ...base.meta, ...parsed.meta } : base.meta
  };
}

/**
 * อ่านข้อมูลทั้งหมดจาก localStorage
 */
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = createDefaultData();
      saveData(data);
      return data;
    }
    return normalizeData(JSON.parse(raw));
  } catch (e) {
    console.error('โหลดข้อมูลไม่ได้:', e);
    return createDefaultData();
  }
}

/**
 * บันทึกข้อมูลทั้งหมดลง localStorage
 */
function saveData(data) {
  try {
    data.meta.lastOpened = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('บันทึกข้อมูลไม่ได้:', e);
    if (window.showToast) window.showToast('บันทึกไม่สำเร็จ ❌ พื้นที่เก็บข้อมูลอาจเต็ม');
    return false;
  }
}

/**
 * สร้าง ID ไม่ซ้ำ
 */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * ล้างข้อมูลทั้งหมด
 */
function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export ข้อมูลเป็น JSON string
 */
function exportData() {
  return JSON.stringify(loadData(), null, 2);
}

/**
 * Import ข้อมูลจาก JSON string
 * @returns {boolean} สำเร็จหรือไม่
 */
function importData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' ||
        !['expenses', 'habits', 'todos', 'notes'].some(k => Array.isArray(parsed[k]))) {
      throw new Error('ไม่ใช่ไฟล์ข้อมูลที่ถูกต้อง');
    }
    return saveData(normalizeData(parsed));
  } catch (e) {
    console.error('Import ไม่สำเร็จ:', e);
    return false;
  }
}

// ====== Date helpers (ใช้เวลาท้องถิ่น ไม่ใช่ UTC) ======
function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayStr() {
  return toDateStr(new Date());
}

function parseDateStr(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(n) {
  return Number(n || 0).toLocaleString('th-TH', { maximumFractionDigits: 2 });
}

// ใช้ชื่อ Store เพื่อไม่ทับ window.Storage ของเบราว์เซอร์
window.Store = {
  loadData,
  saveData,
  genId,
  clearAllData,
  exportData,
  importData,
  STORAGE_KEY
};
window.toDateStr = toDateStr;
window.todayStr = todayStr;
window.parseDateStr = parseDateStr;
window.addDays = addDays;
window.escapeHtml = escapeHtml;
window.formatMoney = formatMoney;
