// storage.js — จัดการ localStorage (Generic CRUD)
// เก็บข้อมูลทั้งหมดใน key เดียวชื่อ "myday_data"

const STORAGE_KEY = 'myday_data';

// โครงสร้างข้อมูลเริ่มต้น
const DEFAULT_DATA = {
  expenses: [],
  habits: [],
  todos: [],
  notes: [],
  meta: { createdAt: null, lastOpened: null }
};

/**
 * อ่านข้อมูลทั้งหมดจาก localStorage
 */
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = { ...DEFAULT_DATA };
      data.meta.createdAt = new Date().toISOString();
      data.meta.lastOpened = new Date().toISOString();
      saveData(data);
      return data;
    }
    const parsed = JSON.parse(raw);
    // ตรวจสอบให้แน่ใจว่ามี key ครบ
    return {
      expenses: parsed.expenses || [],
      habits: parsed.habits || [],
      todos: parsed.todos || [],
      notes: parsed.notes || [],
      meta: parsed.meta || { createdAt: new Date().toISOString(), lastOpened: new Date().toISOString() }
    };
  } catch (e) {
    console.error('โหลดข้อมูลไม่ได้:', e);
    return { ...DEFAULT_DATA };
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
    return false;
  }
}

/**
 * สร้าง ID ไม่ซ้ำ
 */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
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
  const data = loadData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import ข้อมูลจาก JSON string
 * @returns {boolean} สำเร็จหรือไม่
 */
function importData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.expenses && !parsed.habits && !parsed.todos && !parsed.notes) {
      throw new Error('ไม่ใช่ไฟล์ข้อมูลที่ถูกต้อง');
    }
    const data = {
      expenses: parsed.expenses || [],
      habits: parsed.habits || [],
      todos: parsed.todos || [],
      notes: parsed.notes || [],
      meta: parsed.meta || { createdAt: new Date().toISOString(), lastOpened: new Date().toISOString() }
    };
    saveData(data);
    return true;
  } catch (e) {
    console.error('Import ไม่สำเร็จ:', e);
    return false;
  }
}

// Export ให้ใช้ในไฟล์อื่น (global)
window.Storage = {
  loadData,
  saveData,
  genId,
  clearAllData,
  exportData,
  importData,
  STORAGE_KEY
};
