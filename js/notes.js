// notes.js — บันทึกย่อ + ค้นหา

let noteSearchQuery = '';

const Notes = {
  add(content) {
    const trimmed = content.trim();
    if (!trimmed) return null;
    const data = Store.loadData();
    const note = {
      id: Store.genId(),
      content: trimmed,
      createdAt: new Date().toISOString()
    };
    data.notes.push(note);
    Store.saveData(data);
    return note;
  },

  remove(id) {
    const data = Store.loadData();
    data.notes = data.notes.filter(n => n.id !== id);
    Store.saveData(data);
  },

  getAll() {
    const data = Store.loadData();
    return [...data.notes].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  },

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(n => n.content.toLowerCase().includes(q));
  }
};

function renderNoteList(notes, query) {
  if (notes.length === 0) {
    return query.trim()
      ? `<p class="empty-state">ไม่พบบันทึกที่ตรงกับ "${escapeHtml(query)}"</p>`
      : '<p class="empty-state">ยังไม่มีบันทึก 📝 จดอะไรเก็บไว้หน่อย!</p>';
  }
  return notes.map(n => {
    const time = new Date(n.createdAt);
    const timeStr = time.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' ' + time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="note-card">
        <div class="note-content">${escapeHtml(n.content)}</div>
        <div class="note-footer">
          <span class="note-time">🕐 ${timeStr}</span>
          <button class="btn-icon btn-danger" onclick="handleRemoveNote('${n.id}')" title="ลบ" aria-label="ลบบันทึก">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderNotesPage() {
  const notes = Notes.search(noteSearchQuery);

  return `
    <div class="page-header">
      <h1>📝 บันทึกย่อ</h1>
      <p class="subtitle">จดไอเดีย ความคิด หรืออะไรก็ตาม</p>
    </div>

    <div class="card">
      <h3>➕ บันทึกใหม่</h3>
      <form onsubmit="return handleAddNote(event)">
        <textarea id="note-content" placeholder="จดอะไรดี... (Ctrl/⌘ + Enter เพื่อบันทึก)" rows="3" required aria-label="เนื้อหาบันทึก"
          onkeydown="if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); this.form.requestSubmit(); }"></textarea>
        <button type="submit" class="btn btn-primary btn-full">บันทึก</button>
      </form>
    </div>

    <div class="card">
      <h3>🔍 ค้นหา</h3>
      <input type="search" id="note-search" placeholder="ค้นหาบันทึก..." value="${escapeHtml(noteSearchQuery)}"
        oninput="handleNoteSearch(this.value)" aria-label="ค้นหาบันทึก">
    </div>

    <div id="notes-list" class="notes-list">${renderNoteList(notes, noteSearchQuery)}</div>
  `;
}

function handleAddNote(e) {
  e.preventDefault();
  const content = document.getElementById('note-content').value;
  if (!Notes.add(content)) {
    showToast('กรุณาพิมพ์บันทึก');
    return false;
  }
  noteSearchQuery = '';
  refreshPage();
  showToast('บันทึกแล้ว ✍️');
  return false;
}

function handleNoteSearch(query) {
  noteSearchQuery = query;
  document.getElementById('notes-list').innerHTML = renderNoteList(Notes.search(query), query);
}

function handleRemoveNote(id) {
  if (!confirm('ลบบันทึกนี้?')) return;
  Notes.remove(id);
  refreshPage();
}

window.Notes = Notes;
window.renderNotesPage = renderNotesPage;
window.handleAddNote = handleAddNote;
window.handleNoteSearch = handleNoteSearch;
window.handleRemoveNote = handleRemoveNote;
