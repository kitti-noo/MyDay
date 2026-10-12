# MyDay — AI SDLC Plan

> แอปจัดการชีวิตประจำวัน ที่ใช้งานได้จริงทุกวัน

## 1. ภาพรวมโปรเจกต์ (Project Overview)

**ชื่อแอป:** MyDay  
**ประเภท:** Web App (Frontend-only, ไม่ต้องมี Backend)  
**ภาษา UI:** ภาษาไทย  
**การจัดเก็บข้อมูล:** localStorage (เก็บในเครื่องผู้ใช้ ไม่ส่งไปที่ไหน)

## 2. ความต้องการ (Requirements)

### 2.1 ฟีเจอร์หลัก

| # | ฟีเจอร์ | รายละเอียด |
|---|---------|-----------|
| F1 | **ติดตามรายจ่าย** | เพิ่ม/ลบ รายจ่าย ระบุหมวดหมู่ จำนวนเงิน วันที่ สรุปยอดรวมต่อวัน/เดือน แสดงกราฟแสดงสัดส่วนหมวดหมู่ |
| F2 | **ติดตามนิสัย** | สร้างนิสัยที่อยากทำทุกวัน เช็คว่าทำหรือไม่ นับ streak (ทำต่อกันกี่วัน) สถิติรายสัปดาห์ |
| F3 | **รายการ To-Do** | เพิ่ม/แก้ไข/ลบ สิ่งที่ต้องทำ มี priority (สูง/กลาง/ต่ำ) เลื่อนสถานะ (ยังไม่ทำ → กำลังทำ → เสร็จ) |
| F4 | **บันทึกย่อ** | จดบันทึกสั้นๆ ค้นหาได้ มี timestamp |
| F5 | **แดชบอร์ดหลัก** | สรุปภาพรวมวันนี้: ยอดจ่ายวันนี้, นิสัยวันนี้, to-do วันนี้, บันทึกล่าสุด |
| F6 | **Export/Import** | เก็บข้อมูลเป็น JSON และนำเข้าได้ |

### 2.2 ความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional)

- **NFR1:** ทำงานบนมือถือและคอมพิวเตอร์ (Responsive)
- **NFR2:** ใช้ได้แบบ Offline (หลังโหลดครั้งแรกแล้วไม่ต้องต่อเน็ต)
- **NFR3:** ไม่ใช้ framework ภายนอก (vanilla HTML/CSS/JS) เพื่อความเบาและพกพาง่าย
- **NFR4:** ข้อมูลไม่หายเมื่อปิดเบราว์เซอร์ (localStorage)
- **NFR5:** UI สวย อ่านง่าย ใช้สีสบายตา

## 3. การออกแบบ (Design)

### 3.1 โครงสร้างไฟล์

```
/
├── index.html          # หน้าเว็บหลัก (SPA - Single Page Application)
├── css/
│   └── style.css       # สไตล์ทั้งหมด
├── js/
│   ├── app.js          # Logic หลัก + Router + การจัดการ state
│   ├── storage.js       # จัดการ localStorage (CRUD)
│   ├── expenses.js      # Logic รายจ่าย
│   ├── habits.js        # Logic นิสัย
│   ├── todos.js         # Logic To-Do
│   └── notes.js         # Logic บันทึกย่อ
├── docs/
│   ├── plan.md          # เอกสารนี้
│   ├── tasks.md         # Task breakdown + status
│   └── test-results.md  # ผลการทดสอบ
└── README.md
```

### 3.2 การนำทาง (Navigation)

แถบเมนูด้านล่าง (มือถือ) / แถบด้านข้าง (คอม):
- หน้าแรก (Dashboard)
- รายจ่าย
- นิสัย
- To-Do
- บันทึก
- ตั้งค่า (Export/Import)

### 3.3 Data Model

```json
{
  "expenses": [
    { "id": "uuid", "amount": 50, "category": "อาหาร", "note": "ข้าวเที่ยง", "date": "2026-10-12" }
  ],
  "habits": [
    { "id": "uuid", "name": "ออกกำลังกาย", "icon": "🏃", "log": { "2026-10-12": true } }
  ],
  "todos": [
    { "id": "uuid", "title": "ซื้อของ", "priority": "high", "status": "todo", "createdAt": "timestamp" }
  ],
  "notes": [
    { "id": "uuid", "content": "ไอเดียใหม่...", "createdAt": "timestamp" }
  ]
}
```

## 4. SDLC Phase Summary

| Phase | สถานะ | ผลลัพธ์ |
|-------|--------|---------|
| 1. Planning | ✅ เสร็จ | เอกสารนี้ |
| 2. Task Breakdown | ✅ เสร็จ | docs/tasks.md |
| 3. Implementation | ✅ เสร็จ | index.html, css/, js/ |
| 4. Testing | ✅ เสร็จ | docs/test-results.md |
| 5. Documentation | ✅ เสร็จ | README.md |
