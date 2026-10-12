// notes.js — บันทึกย่อ + ค้นหา

const Notes = {
  add(content) {
    const data = Storage.loadData();
    const note = {
      id: Storage.genId(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    data.notes.push(note);
    Storage.saveData(data);
    return note;
  },

  remove(id) {
    const data = Storage.loadData();
    data.notes = data.notes.filter(n => n.id !== id);
    Storage.saveData(data);
  },

  getAll() {
    const data = Storage.loadData();
    return [...data.notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  search(query) {
    if (!query.trim()) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(n => n.content.toLowerCase().includes(q));
  }
};

function renderNotesPage() {
  const notes = Notes.getAll();

  const list = notes.length === 0
    ? '<p class="empty-state">ยังไม่มีบันทึก 📝 จดอะไรเก็บไว้หน่อย!</p>'
    : notes.map(n => {
        const time = new Date(n.createdAt);
        const timeStr = time.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
          + ' ' + time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        return `
          <div class="note-card">
            <div class="note-content">${escapeHtml(n.content)}</div>
            <div class="note-footer">
              <span class="note-time">🕐 ${timeStr}</span>
              <button class="btn-icon btn-danger" onclick="Notes.remove('${n.id}'); refreshPage()" title="ลบ">✕</button>
            </div>
          </div>
        `;
      }).join('');

  return `
    <div class="page-header">
      <h1>📝 บันทึกย่อ</h1>
      <p class="subtitle">จดไอเดีย ความคิด หรืออะไรก็ตาม</p>
    </div>

    <div class="card">
      <h3>➕ บันทึกใหม่</h3>
      <form onsubmit="return handleAddNote(event)">
        <textarea id="note-content" placeholder="จดอะไรดี..." rows="3" required></textarea>
        <button type="submit" class="btn btn-primary btn-full">บันทึก</button>
      </form>
    </div>

    <div class="card">
      <h3>🔍 ค้นหา</h3>
      <input type="text" id="note-search" placeholder="ค้นหาบันทึก..." oninput="handleNoteSearch(this.value)">
    </div>

    <div id="notes-list" class="notes-list">${list}</div>
  `;
}

function handleAddNote(e) {
  e.preventDefault();
  const content = document.getElementById('note-content').value;
  Notes.add(content);
  refreshPage();
  return false;
}

function handleNoteSearch(query) {
  const results = Notes.search(query);
  const list = results.length === 0
    ? '<p class="empty-state">ไม่พบบันทึกที่ตรงกับ "${escapeHtml(query)}"</p>'
    : results.map(n => {
        const time = new Date(n.createdAt);
        const timeStr = time.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
          + ' ' + time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        return `
          <div class="note-card">
            <div class="note-content">${escapeHtml(n.content)}</div>
            <div class="note-footer">
              <span class="note-time">🕐 ${timeStr}</span>
              <button class="btn-icon btn-danger" onclick="Notes.remove('${n.id}'); refreshPage()">✕</button>
            </div>
          </div>
        `;
      }).join('');
  document.getElementById('notes-list').innerHTML = list;
}

window.Notes = Notes;
window.renderNotesPage = renderNotesPage;
window.handleAddNote = handleAddNote;
window.handleNoteSearch = handleNoteSearch;
