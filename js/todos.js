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

const Todos = {
  add(title, priority = 'medium') {
    const data = Storage.loadData();
    const todo = {
      id: Storage.genId(),
      title: title.trim(),
      priority,
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    data.todos.push(todo);
    Storage.saveData(data);
    return todo;
  },

  remove(id) {
    const data = Storage.loadData();
    data.todos = data.todos.filter(t => t.id !== id);
    Storage.saveData(data);
  },

  setStatus(id, status) {
    const data = Storage.loadData();
    const todo = data.todos.find(t => t.id === id);
    if (todo) {
      todo.status = status;
      if (status === 'done') todo.completedAt = new Date().toISOString();
      Storage.saveData(data);
    }
  },

  getAll() {
    const data = Storage.loadData();
    return [...data.todos].sort((a, b) => {
      // เรียง priority: high > medium > low
      const pOrder = { high: 0, medium: 1, low: 2 };
      const pd = pOrder[a.priority] - pOrder[b.priority];
      if (pd !== 0) return pd;
      return b.createdAt.localeCompare(a.createdAt);
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
    `<option value="${p.id}">${p.label}</option>`
  ).join('');

  const columns = TODO_STATUSES.map(status => {
    const items = Todos.getByStatus(status.id);
    const itemHtml = items.length === 0
      ? '<div class="kanban-empty">ไม่มีรายการ</div>'
      : items.map(t => {
          const p = getPriorityInfo(t.priority);
          const nextStatusIdx = TODO_STATUSES.findIndex(s => s.id === status.id);
          const nextStatus = TODO_STATUSES[nextStatusIdx + 1];
          return `
            <div class="todo-card" style="border-left:4px solid ${p.color}">
              <div class="todo-title">${escapeHtml(t.title)}</div>
              <div class="todo-meta">
                <span class="priority-tag" style="background:${p.color}22;color:${p.color}">${p.label}</span>
                <span class="todo-actions">
                  ${nextStatus ? `<button class="btn-mini" onclick="Todos.setStatus('${t.id}','${nextStatus.id}'); refreshPage()">→ ${nextStatus.label}</button>` : ''}
                  <button class="btn-mini btn-danger-text" onclick="Todos.remove('${t.id}'); refreshPage()">ลบ</button>
                </span>
              </div>
            </div>
          `;
        }).join('');

    return `
      <div class="kanban-col">
        <div class="kanban-header">
          <span>${status.label}</span>
          <span class="kanban-count">${items.length}</span>
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
        <input type="text" id="todo-title" placeholder="อะไรที่ต้องทำ?" required>
        <select id="todo-priority">
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
  Todos.add(title, priority);
  refreshPage();
  return false;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.Todos = Todos;
window.renderTodosPage = renderTodosPage;
window.handleAddTodo = handleAddTodo;
window.escapeHtml = escapeHtml;
