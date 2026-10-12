// todos.js — รายการสิ่งที่ต้องทำ (Kanban-style)

const TODO_PRIORITIES = [
  { id: 'high', label: 'สูง', color: '#e74c3c' },
  { id: 'medium', label: 'กลาง', color: '#f39c12' },
  { id: 'low', label: 'ต่ำ', color: '#27ae60' }
];

const TODO_STATUSES = [
  { id: 'todo', label: 'ยังไม่ทำ' },
  { id: 'doing', label: 'กำลังทำ' },
  { id: 'done', label: 'เสร็จแล้ว' }
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const Todos = {
  add(title, priority = 'medium') {
    const trimmed = title.trim();
    if (!trimmed) return null;
    const data = Store.loadData();
    const todo = {
      id: Store.genId(),
      title: trimmed,
      priority: PRIORITY_ORDER[priority] !== undefined ? priority : 'medium',
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    data.todos.push(todo);
    Store.saveData(data);
    return todo;
  },

  remove(id) {
    const data = Store.loadData();
    data.todos = data.todos.filter(t => t.id !== id);
    Store.saveData(data);
  },

  clearDone() {
    const data = Store.loadData();
    const before = data.todos.length;
    data.todos = data.todos.filter(t => t.status !== 'done');
    Store.saveData(data);
    return before - data.todos.length;
  },

  setStatus(id, status) {
    const data = Store.loadData();
    const todo = data.todos.find(t => t.id === id);
    if (todo) {
      todo.status = status;
      if (status === 'done') todo.completedAt = new Date().toISOString();
      else delete todo.completedAt;
      Store.saveData(data);
    }
  },

  getAll() {
    const data = Store.loadData();
    return [...data.todos].sort((a, b) => {
      const pd = (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
      if (pd !== 0) return pd;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  },

  getByStatus(status) {
    return this.getAll().filter(t => t.status === status);
  },

  getStats() {
    const all = this.getAll();
    return {
      total: all.length,
      todo: all.filter(t => t.status === 'todo').length,
      doing: all.filter(t => t.status === 'doing').length,
      done: all.filter(t => t.status === 'done').length
    };
  }
};

function getPriorityInfo(id) {
  return TODO_PRIORITIES.find(p => p.id === id) || TODO_PRIORITIES[1];
}

function renderTodosPage() {
  const stats = Todos.getStats();
  const priorityOptions = TODO_PRIORITIES.map(p =>
    `<option value="${p.id}" ${p.id === 'medium' ? 'selected' : ''}>${p.label}</option>`
  ).join('');

  const columns = TODO_STATUSES.map((status, idx) => {
    const items = Todos.getByStatus(status.id);
    const prevStatus = TODO_STATUSES[idx - 1];
    const nextStatus = TODO_STATUSES[idx + 1];
    const itemHtml = items.length === 0
      ? '<div class="kanban-empty">ไม่มีรายการ</div>'
      : items.map(t => {
          const p = getPriorityInfo(t.priority);
          return `
            <div class="todo-card ${status.id === 'done' ? 'todo-done' : ''}" style="border-left:4px solid ${p.color}">
              <div class="todo-title">${escapeHtml(t.title)}</div>
              <div class="todo-meta">
                <span class="priority-tag" style="background:${p.color}22;color:${p.color}">${p.label}</span>
                <span class="todo-actions">
                  ${prevStatus ? `<button class="btn-mini" onclick="handleTodoStatus('${t.id}','${prevStatus.id}')" title="ย้ายกลับไป ${prevStatus.label}" aria-label="ย้ายกลับไป ${prevStatus.label}">←</button>` : ''}
                  ${nextStatus ? `<button class="btn-mini" onclick="handleTodoStatus('${t.id}','${nextStatus.id}')">→ ${nextStatus.label}</button>` : ''}
                  <button class="btn-mini btn-danger-text" onclick="handleRemoveTodo('${t.id}')">ลบ</button>
                </span>
              </div>
            </div>
          `;
        }).join('');

    const clearBtn = status.id === 'done' && items.length > 0
      ? '<button class="btn-mini btn-danger-text" onclick="handleClearDoneTodos()">ล้าง</button>'
      : '';

    return `
      <div class="kanban-col">
        <div class="kanban-header">
          <span>${status.label}</span>
          <span class="kanban-header-right">${clearBtn}<span class="kanban-count">${items.length}</span></span>
        </div>
        <div class="kanban-body">${itemHtml}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header">
      <h1>✅ สิ่งที่ต้องทำ</h1>
      <p class="subtitle">จัดการงานตามลำดับความสำคัญ</p>
    </div>

    <div class="todo-stats">
      <div class="todo-stat"><span class="stat-num">${stats.todo}</span><span class="stat-label">ยังไม่ทำ</span></div>
      <div class="todo-stat"><span class="stat-num">${stats.doing}</span><span class="stat-label">กำลังทำ</span></div>
      <div class="todo-stat"><span class="stat-num">${stats.done}</span><span class="stat-label">เสร็จแล้ว</span></div>
    </div>

    <div class="card">
      <h3>➕ เพิ่มสิ่งที่ต้องทำ</h3>
      <form onsubmit="return handleAddTodo(event)" class="todo-form">
        <input type="text" id="todo-title" placeholder="อะไรที่ต้องทำ?" required maxlength="200" aria-label="สิ่งที่ต้องทำ">
        <select id="todo-priority" aria-label="ความสำคัญ">
          ${priorityOptions}
        </select>
        <button type="submit" class="btn btn-primary">เพิ่ม</button>
      </form>
    </div>

    <div class="kanban-board">
      ${columns}
    </div>
  `;
}

function handleAddTodo(e) {
  e.preventDefault();
  const title = document.getElementById('todo-title').value;
  const priority = document.getElementById('todo-priority').value;
  if (!Todos.add(title, priority)) {
    showToast('กรุณาใส่สิ่งที่ต้องทำ');
    return false;
  }
  refreshPage();
  document.getElementById('todo-title')?.focus();
  return false;
}

function handleTodoStatus(id, status) {
  Todos.setStatus(id, status);
  refreshPage();
  if (status === 'done') showToast('เยี่ยม! เสร็จไปอีกงาน 🎉');
}

function handleRemoveTodo(id) {
  if (!confirm('ลบงานนี้?')) return;
  Todos.remove(id);
  refreshPage();
}

function handleClearDoneTodos() {
  if (!confirm('ล้างงานที่เสร็จแล้วทั้งหมด?')) return;
  const n = Todos.clearDone();
  refreshPage();
  showToast(`ล้างงานที่เสร็จแล้ว ${n} รายการ`);
}

window.Todos = Todos;
window.renderTodosPage = renderTodosPage;
window.handleAddTodo = handleAddTodo;
window.handleTodoStatus = handleTodoStatus;
window.handleRemoveTodo = handleRemoveTodo;
window.handleClearDoneTodos = handleClearDoneTodos;
window.getPriorityInfo = getPriorityInfo;
