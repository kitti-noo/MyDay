# MyDay — Task Breakdown

> ติดตามสถานะงานทั้งหมด อัปเดตเรียลไทม์

## Task List

| ID | Phase | Task | สถานะ | หมายเหตุ |
|----|-------|------|--------|----------|
| T01 | Setup | สร้างโครงสร้างโฟลเดอร์และไฟล์ | ✅ เสร็จ | โครงสร้างพร้อม |
| T02 | Plan | เขียน SDLC Plan | ✅ เสร็จ | docs/plan.md |
| T03 | Plan | เขียน Task Breakdown | ✅ เสร็จ | docs/tasks.md |
| T04 | Plan | เขียน Test Plan | ✅ เสร็จ | docs/test-results.md |
| T05 | Dev | สร้าง index.html (โครง HTML + โครงหน้าต่างๆ) | ✅ เสร็จ | SPA layout |
| T06 | Dev | สร้าง css/style.css (responsive + theme) | ✅ เสร็จ | Mobile-first |
| T07 | Dev | สร้าง js/storage.js (localStorage CRUD) | ✅ เสร็จ | Generic storage |
| T08 | Dev | สร้าง js/expenses.js (รายจ่าย) | ✅ เสร็จ | Add/delete/summary |
| T09 | Dev | สร้าง js/habits.js (นิสัย + streak) | ✅ เสร็จ | Toggle + streak calc |
| T10 | Dev | สร้าง js/todos.js (To-Do + priority + status) | ✅ เสร็จ | Kanban-style |
| T11 | Dev | สร้าง js/notes.js (บันทึกย่อ + ค้นหา) | ✅ เสร็จ | Search + timestamp |
| T12 | Dev | สร้าง js/app.js (router + dashboard + init) | ✅ เสร็จ | Hash router |
| T13 | Dev | ฟีเจอร์ Export/Import JSON | ✅ เสร็จ | ในหน้าตั้งค่า |
| T14 | Test | ทดสอบฟังก์ชันรายจ่าย | ✅ เสร็จ | ดู test-results.md |
| T15 | Test | ทดสอบฟังก์ชันนิสัย + streak | ✅ เสร็จ | ดู test-results.md |
| T16 | Test | ทดสอบฟังก์ชัน To-Do | ✅ เสร็จ | ดู test-results.md |
| T17 | Test | ทดสอบฟังก์ชันบันทึกย่อ | ✅ เสร็จ | ดู test-results.md |
| T18 | Test | ทดสอบ localStorage persistence | ✅ เสร็จ | ดู test-results.md |
| T19 | Test | ทดสอบ Export/Import | ✅ เสร็จ | ดู test-results.md |
| T20 | Test | ทดสอบ Responsive (มือถือ/คอม) | ✅ เสร็จ | ดู test-results.md |
| T21 | Doc | เขียน README.md | ✅ เสร็จ | วิธีใช้งาน |
| T22 | v1.1 Fix | แก้วันที่ใช้ UTC → ใช้เวลาท้องถิ่น (00:00–07:00 เวลาไทยนับเป็นเมื่อวาน) | ✅ เสร็จ | storage.js helpers |
| T23 | v1.1 Fix | ป้องกัน XSS ชื่อนิสัย/หมายเหตุรายจ่าย | ✅ เสร็จ | escapeHtml |
| T24 | v1.1 Fix | แก้ CSS `var(--x)11` ที่ใช้ไม่ได้ → color-mix | ✅ เสร็จ | style.css |
| T25 | v1.1 Fix | แก้ข้อความค้นหาบันทึกไม่พบ, ไม่ทับ `window.Storage` | ✅ เสร็จ | notes.js, storage.js |
| T26 | v1.1 PWA | Manifest + Service Worker + ไอคอน (ติดตั้ง/ออฟไลน์) | ✅ เสร็จ | sw.js |
| T27 | v1.1 UX | ธีมมืด, ยืนยันก่อนลบ, ดูรายจ่ายรายเดือน, เช็คนิสัยย้อนหลัง, ย้าย To-Do กลับ | ✅ เสร็จ | |
| T28 | v1.1 Test | ทดสอบ v1.1 (Playwright, Asia/Bangkok) | ✅ เสร็จ | ดู test-results.md |

## สรุปสถานะ

- **งานทั้งหมด:** 28 งาน
- **เสร็จแล้ว:** 28 งาน
- **คงเหลือ:** 0 งาน
- **ความคืบหน้า:** 100% ✅
