// habits.js — ติดตามนิสัย + Streak

const HABIT_ICONS = ['🏃', '📚', '💧', '🧘', '💪', '🥗', '😴', '🚭', '✍️', '🦷', '☀️', '🎸'];

const Habits = {
  /**
   * สร้างนิสัยใหม่
   */
  add(name, icon = '🏃') {
    const data = Storage.loadData();
    const habit = {
      id: Storage.genId(),
      name: name.trim(),
      icon: icon,
      log: {} // { "2026-10-12": true }
    };
    data.habits.push(habit);
    Storage.saveData(data);
    return habit;
  },

  /**
   * ลบนิสัย
   */
  remove(id) {
    const data = Storage.loadData();
    data.habits = data.habits.filter(h => h.id !== id);
    Storage.saveData(data);
  },

  /**
   * สลับสถานะเช็คของวันที่กำหนด (default = วันนี้)
   */
  toggle(id, date = null) {
    const data = Storage.loadData();
    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;
    const dateStr = date || new Date().toISOString().slice(0, 10);
    if (habit.log[dateStr]) {
      delete habit.log[dateStr];
    } else {
      habit.log[dateStr] = true;
    }
    Storage.saveData(data);
  },

  /**
   * คำนวณ streak ปัจจุบัน (ทำต่อกันกี่วัน นับจากวันนี้หรือเมื่อวาน)
   */
  getStreak(habit) {
    const log = habit.log || {};
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);

    // ถ้าวันนี้ยังไม่ได้ทำ ให้เริ่มนับจากเมื่อวาน
    let startFrom = log[todayStr] ? today : new Date(today.getTime() - 86400000);
    if (!log[todayStr] && !log[yesterdayStr]) return 0;

    let streak = 0;
    let cursor = new Date(startFrom);
    while (true) {
      const cursorStr = cursor.toISOString().slice(0, 10);
      if (log[cursorStr]) {
        streak++;
        cursor = new Date(cursor.getTime() - 86400000);
      } else {
        break;
      }
    }
    return streak;
  },

  /**
   * ดึงนิสัยทั้งหมด
   */
  getAll() {
    const data = Storage.loadData();
    return data.habits;
  },

  /**
   * สรุปสถิติสัปดาห์นี้
   */
  getWeekStats(habit) {
    const log = habit.log || {};
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      if (log[d.toISOString().slice(0, 10)]) count++;
    }
    return count;
  },

  /**
   * เช็คว่าวันนี้ทำหรือยัง
   */
  isDoneToday(habit) {
    const todayStr = new Date().toISOString().slice(0, 10);
    return !!(habit.log && habit.log[todayStr]);
  },

  /**
   * สร้างปฏิทิน 7 วันย้อนหลัง
   */
  getLast7Days(habit) {
    const log = habit.log || {};
    const today = new Date();
    const days = [];
    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      const dStr = d.toISOString().slice(0, 10);
      days.push({
        date: dStr,
        dayName: dayNames[d.getDay()],
        done: !!log[dStr],
        isToday: i === 0
      });
    }
    return days;
  }
};

function renderHabitsPage() {
  const habits = Habits.getAll();

  const list = habits.length === 0
    ? '<p class="empty-state">ยังไม่มีนิสัย 🌱 ลองเพิ่มนิสัยที่อยากทำทุกวันดูสิ!</p>'
    : habits.map(h => {
        const streak = Habits.getStreak(h);
        const doneToday = Habits.isDoneToday(h);
        const weekCount = Habits.getWeekStats(h);
        const last7 = Habits.getLast7Days(h);
        const daysHtml = last7.map(d => `
          <div class="habit-day ${d.done ? 'done' : ''} ${d.isToday ? 'today' : ''}">
            <span class="habit-day-name">${d.dayName}</span>
            <span class="habit-day-dot">${d.done ? '✓' : '·'}</span>
          </div>
        `).join('');

        return `
          <div class="habit-card ${doneToday ? 'completed' : ''}">
            <div class="habit-top">
              <div class="habit-info">
                <span class="habit-emoji">${h.icon}</span>
                <div>
                  <div class="habit-name">${h.name}</div>
                  <div class="habit-stats">
                    <span class="streak-badge ${streak > 0 ? 'active' : ''}">🔥 ${streak} วันต่อเนื่อง</span>
                    <span>📊 สัปดาห์นี้ ${weekCount}/7</span>
                  </div>
                </div>
              </div>
              <button class="btn-icon btn-danger" onclick="Habits.remove('${h.id}'); refreshPage()" title="ลบ">✕</button>
            </div>
            <div class="habit-week">${daysHtml}</div>
            <button class="btn ${doneToday ? 'btn-success' : 'btn-primary'} btn-full habit-toggle"
              onclick="Habits.toggle('${h.id}'); refreshPage()">
              ${doneToday ? '✅ ทำเสร็จแล้ววันนี้' : '⭕ ทำเช็ควันนี้'}
            </button>
          </div>
        `;
      }).join('');

  const iconPicker = HABIT_ICONS.map((icon, i) =>
    `<label class="icon-option"><input type="radio" name="habit-icon" value="${icon}" ${i === 0 ? 'checked' : ''}><span>${icon}</span></label>`
  ).join('');

  return `
    <div class="page-header">
      <h1>🌱 นิสัย</h1>
      <p class="subtitle">สร้างนิสัยที่ดี ทำต่อเนื่องทุกวัน</p>
    </div>

    <div class="card">
      <h3>➕ เพิ่มนิสัยใหม่</h3>
      <form onsubmit="return handleAddHabit(event)">
        <input type="text" id="habit-name" placeholder="ชื่อนิสัย (เช่น อ่านหนังสือ 30 นาที)" required>
        <div class="icon-picker">${iconPicker}</div>
        <button type="submit" class="btn btn-primary btn-full">เพิ่มนิสัย</button>
      </form>
    </div>

    <div class="habits-list">${list}</div>
  `;
}

function handleAddHabit(e) {
  e.preventDefault();
  const name = document.getElementById('habit-name').value;
  const icon = document.querySelector('input[name="habit-icon"]:checked')?.value || '🏃';
  Habits.add(name, icon);
  refreshPage();
  return false;
}

window.Habits = Habits;
window.renderHabitsPage = renderHabitsPage;
window.handleAddHabit = handleAddHabit;
