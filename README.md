# 🗓️ MyDay — แอปจัดการชีวิตประจำวัน

เว็บแอป (PWA) ที่รวมฟีเจอร์ที่ใช้ทุกวัน — **ติดตั้งลงมือถือ/คอมได้ ใช้งานออฟไลน์ได้** ข้อมูลอยู่ในเครื่องคุณเท่านั้น

- 💰 **ติดตามรายจ่าย** — เพิ่ม/ลบ รายจ่าย สรุปยอดวันนี้/รายเดือน ดูย้อนหลังทีละเดือน กราฟสัดส่วนหมวดหมู่
- 🌱 **ติดตามนิสัย** — เช็คทุกวัน นับ streak + สถิติสูงสุด แตะปฏิทิน 7 วันเพื่อเช็คย้อนหลังได้
- ✅ **รายการ To-Do** — Kanban (ยังไม่ทำ ⇄ กำลังทำ ⇄ เสร็จ) มี priority ย้ายกลับได้ ล้างงานที่เสร็จได้
- 📝 **บันทึกย่อ** — จดไอเดีย ค้นหาได้ (Ctrl/⌘ + Enter เพื่อบันทึก)
- 🏠 **แดชบอร์ด** — สรุปภาพรวมวันนี้ในหน้าเดียว
- 🎨 **ธีมสว่าง/มืด** — ตามระบบหรือเลือกเอง
- 💾 **Export/Import** — สำรอง/ย้ายข้อมูลเป็นไฟล์ JSON

## 🚀 วิธีใช้งาน

### ใช้งานออนไลน์ (แนะนำ) — GitHub Pages

เปิด GitHub Pages ครั้งเดียว: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**

จากนั้นเข้าใช้ที่ `https://kitti-noo.github.io/MyDay/` แล้วติดตั้งเป็นแอป:

- 📱 **iPhone/iPad (Safari):** ปุ่มแชร์ → "เพิ่มไปยังหน้าจอโฮม"
- 🤖 **Android (Chrome):** เมนู ⋮ → "ติดตั้งแอป"
- 💻 **Chrome/Edge:** ไอคอนติดตั้งที่แถบที่อยู่ หรือ ตั้งค่า → "📲 ติดตั้งแอป"

### รันในเครื่อง

```bash
python3 -m http.server 8000
# แล้วเปิด http://localhost:8000
```

> เปิด `index.html` ตรงๆ (file://) ก็ใช้งานได้ แต่จะติดตั้งเป็นแอป/ใช้ออฟไลน์ไม่ได้ เพราะ Service Worker ต้องรันผ่าน http(s)

## 📱 รองรับ

- มือถือ (เมนูด้านล่าง รองรับ notch / safe area)
- คอมพิวเตอร์ (เมนูด้านซ้าย)
- ใช้งานแบบ Offline ได้ (หลังโหลดครั้งแรก)
- วันที่คำนวณตามเวลาท้องถิ่น (เช่น เวลาไทย) และอัปเดตเองเมื่อข้ามวัน

## 🛠️ เทคโนโลยี

- Vanilla HTML/CSS/JavaScript (ไม่ใช้ framework ไม่ต้อง build)
- localStorage สำหรับเก็บข้อมูล
- Web App Manifest + Service Worker (PWA)
- ไม่ต้อง Backend ไม่ต้อง Database

## 📂 โครงสร้างไฟล์

```
MyDay/
├── index.html             # หน้าเว็บหลัก
├── manifest.webmanifest   # ข้อมูลแอป (PWA)
├── sw.js                  # Service Worker (แคชไว้ใช้ออฟไลน์)
├── icons/                 # ไอคอนแอป
├── css/style.css          # สไตล์ทั้งหมด (responsive + dark mode)
├── js/
│   ├── storage.js         # จัดการ localStorage + date/escape helpers
│   ├── expenses.js        # รายจ่าย
│   ├── habits.js          # นิสัย + streak
│   ├── todos.js           # To-Do (Kanban)
│   ├── notes.js           # บันทึกย่อ
│   └── app.js             # Router + Dashboard + Settings + PWA
├── docs/
│   ├── plan.md            # SDLC Plan
│   ├── tasks.md           # Task breakdown
│   └── test-results.md    # ผลการทดสอบ
└── README.md
```

> 🔄 เมื่อแก้ไขไฟล์ในแอป ให้เปลี่ยน `CACHE_VERSION` ใน `sw.js` (และ `APP_VERSION` ใน `js/app.js`) เพื่อให้ผู้ใช้ได้รับเวอร์ชันใหม่

## 📋 เอกสาร SDLC

- [แผนโปรเจกต์ (SDLC Plan)](docs/plan.md)
- [Task Breakdown + สถานะ](docs/tasks.md)
- [ผลการทดสอบ](docs/test-results.md)

---

สร้างด้วย ❤️ ผ่านกระบวนการ AI SDLC
