// habits.js — ติดตามนิสัย + Streak

const HABIT_ICONS = ['🏃', '📚', '💧', '🧘', '💪', '🥗', '😴', '🚭', '✍️', '🦷', '☀️', '🎸'];

const Habits = {
  add(name, icon = '🏃') {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const data = Store.loadData();
    const habit = {
      id: Store.genId(),
      name: trimmed,
      icon: HABIT_ICONS.includes(icon) ? icon : HABIT_ICONS[0],
      log: {} // { "2026-10-12": true }
    };
    data.habits.push(habit);
    Store.saveData(data);
    return habit;
  },

  remove(id) {
    const data = Store.loadData();
    data.habits = data.habits.filter(h => h.id !== id);
    Store.saveData(data);
  },

  /**
   * สลับสถานะเช็คของวันที่กำหนด (default = วันนี้)
   */
  toggle(id, date = null) {
    const data = Store.loadData();
    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;
    const dateStr = date || todayStr();
    if (dateStr > todayStr()) return;
    if (habit.log[dateStr]) {
      delete habit.log[dateStr];
    } else {
      habit.log[dateStr] = true;
    }
    Store.saveData(data);
  },

  /**
   * คำนวณ streak ปัจจุบัน (ทำต่อกันกี่วัน นับจากวันนี้ หรือเมื่อวานถ้าวันนี้ยังไม่ทำ)
   */
  getStreak(habit) {
    const log = habit.log || {};
    let cursor = new Date();
    if (!log[toDateStr(cursor)]) cursor = addDays(cursor, -1);
    let streak = 0;
    while (log[toDateStr(cursor)]) {
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  },

  getBestStreak(habit) {
    const dates = Object.keys(habit.log || {}).filter(k => habit.log[k]).sort();
    let best = 0;
    let run = 0;
    let prev = null;
    dates.forEach(d => {
      run = prev && toDateStr(addDays(parseDateStr(prev), 1)) === d ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    });
    return best;
  },

  getAll() {
    return Store.loadData().habits;
  },

  /**
   * จำนวนวันที่ทำใน 7 วันล่าสุด
   */
  getWeekStats(habit) {
    return this.getLast7Days(habit).filter(d => d.done).length;
  },

  isDoneToday(habit) {
    return !!(habit.log && habit.log[todayStr()]);
  },

  /**
   * ปฏิทิน 7 วันย้อนหลัง
   */
  getLast7Days(habit) {
    const log = habit.log || {};
    const today = new Date();
    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(today, -i);
      const dStr = toDateStr(d);
      days.push({
        date: dStr,
        dayName: dayNames[d.getDay()],
        dayNum: d.getDate(),
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
        const best = Habits.getBestStreak(h);
        const doneToday = Habits.isDoneToday(h);
        const weekCount = Habits.getWeekStats(h);
        const daysHtml = Habits.getLast7Days(h).map(d => `
          <button type="button" class="habit-day ${d.done ? 'done' : ''} ${d.isToday ? 'today' : ''}"
            onclick="handleToggleHabit('${h.id}','${d.date}')"
            aria-pressed="${d.done}" aria-label="${d.dayName} ${d.dayNum}" title="แตะเพื่อเช็ค/ยกเลิก">
            <span class="habit-day-name">${d.dayName}</span>
            <span class="habit-day-dot">${d.done ? '✓' : d.dayNum}</span>
          </button>
        `).join('');

        return `
          <div class="habit-card ${doneToday ? 'completed' : ''}">
            <div class="habit-top">
              <div class="habit-info">
                <span class="habit-emoji">${h.icon}</span>
                <div>
                  <div class="habit-name">${escapeHtml(h.name)}</div>
                  <div class="habit-stats">
                    <span class="streak-badge ${streak > 0 ? 'active' : ''}">🔥 ${streak} วันต่อเนื่อง</span>
                    <span>📊 7 วันล่าสุด ${weekCount}/7</span>
                    ${best > 0 ? `<span>🏆 สูงสุด ${best} วัน</span>` : ''}
                  </div>
                </div>
              </div>
              <button class="btn-icon btn-danger" onclick="handleRemoveHabit('${h.id}')" title="ลบ" aria-label="ลบนิสัย">✕</button>
            </div>
            <div class="habit-week">${daysHtml}</div>
            <button class="btn ${doneToday ? 'btn-success' : 'btn-primary'} btn-full habit-toggle"
              onclick="handleToggleHabit('${h.id}')">
              ${doneToday ? '✅ ทำเสร็จแล้ววันนี้' : '⭕ เช็คว่าทำแล้ววันนี้'}
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
      <p class="subtitle">สร้างนิสัยที่ดี ทำต่อเนื่องทุกวัน · แตะวันในปฏิทินเพื่อเช็คย้อนหลังได้</p>
    </div>

    <div class="card">
      <h3>➕ เพิ่มนิสัยใหม่</h3>
      <form onsubmit="return handleAddHabit(event)">
        <input type="text" id="habit-name" placeholder="ชื่อนิสัย (เช่น อ่านหนังสือ 30 นาที)" required maxlength="80" aria-label="ชื่อนิสัย">
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
  const icon = document.querySelector('input[name="habit-icon"]:checked')?.value || HABIT_ICONS[0];
  if (!Habits.add(name, icon)) {
    showToast('กรุณาใส่ชื่อนิสัย');
    return false;
  }
  refreshPage();
  showToast('เพิ่มนิสัยแล้ว 🌱');
  return false;
}

function handleToggleHabit(id, date) {
  Habits.toggle(id, date);
  refreshPage();
}

function handleRemoveHabit(id) {
  if (!confirm('ลบนิสัยนี้และประวัติทั้งหมด?')) return;
  Habits.remove(id);
  refreshPage();
  showToast('ลบนิสัยแล้ว');
}

window.Habits = Habits;
window.renderHabitsPage = renderHabitsPage;
window.handleAddHabit = handleAddHabit;
window.handleToggleHabit = handleToggleHabit;
window.handleRemoveHabit = handleRemoveHabit;
