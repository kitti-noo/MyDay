# 🗓️ MyDay — แอปจัดการชีวิตประจำวัน

แอปเว็บที่รวมฟีเจอร์ที่ใช้ทุกวัน:
- 💰 **ติดตามรายจ่าย** — เพิ่ม/ลบ รายจ่าย สรุปยอดต่อวัน/เดือน กราฟสัดส่วนหมวดหมู่
- 🌱 **ติดตามนิสัย** — สร้างนิสัยที่อยากทำทุกวัน นับ streak สถิติสัปดาห์
- ✅ **รายการ To-Do** — จัดการแบบ Kanban (ยังไม่ทำ → กำลังทำ → เสร็จ) มี priority
- 📝 **บันทึกย่อ** — จดไอเดีย ความคิด ค้นหาได้
- 🏠 **แดชบอร์ด** — สรุปภาพรวมวันนี้ทั้งหมดในหน้าเดียว
- 💾 **Export/Import** — สำรองข้อมูลเป็น JSON

## 🚀 วิธีใช้งาน

1. เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ (เปิดได้เลย ไม่ต้องลง server)
2. เริ่มใช้งานได้เลบ! ข้อมูลเก็บในเครื่องของคุณ (localStorage)

## 📱 รองรับ

- มือถือ (เมนูด้านล่าง)
- คอมพิวเตอร์ (เมนูด้านซ้าย)
- ใช้งานแบบ Offline ได้ (หลังโหลดครั้งแรก)

## 🛠️ เทคโนโลยี

- Vanilla HTML/CSS/JavaScript (ไม่ใช้ framework)
- localStorage สำหรับเก็บข้อมูล
- ไม่ต้อง Backend ไม่ต้อง Database

## 📂 โครงสร้างไฟล์

```
MyDay/
├── index.html          # หน้าเว็บหลัก
├── css/style.css       # สไตล์ทั้งหมด (responsive)
├── js/
│   ├── storage.js       # จัดการ localStorage
│   ├── expenses.js      # รายจ่าย
│   ├── habits.js        # นิสัย + streak
│   ├── todos.js         # To-Do (Kanban)
│   ├── notes.js         # บันทึกย่อ
│   └── app.js           # Router + Dashboard + Settings
├── docs/
│   ├── plan.md          # SDLC Plan
│   ├── tasks.md         # Task breakdown
│   └── test-results.md  # ผลการทดสอบ
└── README.md
```

## 📋 เอกสาร SDLC

- [แผนโปรเจกต์ (SDLC Plan)](docs/plan.md)
- [Task Breakdown + สถานะ](docs/tasks.md)
- [ผลการทดสอบ](docs/test-results.md)

---

สร้างด้วย ❤️ ผ่านกระบวนการ AI SDLC
