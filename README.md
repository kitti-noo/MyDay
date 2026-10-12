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

### 1) ใช้งานออนไลน์ (แนะนำ — ไม่ต้องติดตั้งอะไร)

เปิด 👉 **https://kitti-noo.github.io/MyDay/** แล้วติดตั้งเป็นแอปได้เลย:

- 📱 **iPhone/iPad (Safari):** ปุ่มแชร์ → "เพิ่มไปยังหน้าจอโฮม"
- 🤖 **Android (Chrome):** เมนู ⋮ → "ติดตั้งแอป"
- 💻 **Chrome/Edge:** ไอคอนติดตั้งที่แถบที่อยู่ หรือ ตั้งค่า → "📲 ติดตั้งแอป"

> GitHub Pages เปิดไว้แล้ว (Settings → Pages → Deploy from a branch → `main` / `(root)`) — push ขึ้น `main` เมื่อไหร่ เว็บอัปเดตเองภายใน ~1 นาที

### 2) รันในเครื่อง (สำหรับพัฒนา/แก้ไข)

แอปนี้เป็น **static files ล้วน** (HTML/CSS/JS) — ไม่มี build, ไม่มี dependency, ไม่ต้อง `npm install`
ที่ต้องใช้ local server เพราะ **Service Worker (ออฟไลน์/ติดตั้งแอป) ทำงานได้เฉพาะผ่าน `http://localhost` หรือ `https://`** เท่านั้น ไม่ทำงานผ่าน `file://`

**ขั้นตอน**

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/kitti-noo/MyDay.git
cd MyDay

# 2. รัน static server ตัวไหนก็ได้ (เลือกตามที่เครื่องมี)
```

| เครื่องมือ | ต้องมี | คำสั่ง | เปิดที่ |
|-----------|--------|--------|--------|
| **VS Code Live Server** | ส่วนขยาย [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) | คลิกขวา `index.html` → *Open with Live Server* | http://127.0.0.1:5500 |
| **Node.js** | Node 18+ | `npx serve .` | http://localhost:3000 |
| **Python** | Python 3 (macOS/Linux มีติดมาแล้ว) | `python3 -m http.server 8000` | http://localhost:8000 |
| **PHP** | PHP | `php -S localhost:8000` | http://localhost:8000 |

**3. เปิด URL ในเบราว์เซอร์** — เสร็จแล้ว 🎉

> 💡 **ไม่อยากลงอะไรเลย?** ดับเบิลคลิก `index.html` เปิดตรงๆ ได้ ทุกฟีเจอร์ใช้งานได้ปกติ ยกเว้น *ติดตั้งเป็นแอป* และ *ออฟไลน์*
>
> ⚠️ ข้อมูลเก็บแยกตาม URL — ข้อมูลที่ `localhost:8000`, `file://` และ GitHub Pages **ไม่ใช่ชุดเดียวกัน** ใช้ Export/Import ในหน้าตั้งค่าเพื่อย้ายข้อมูล
>
> 🔄 ระหว่างพัฒนา ถ้าแก้โค้ดแล้วไม่เห็นผล: DevTools → Application → Service Workers → ติ๊ก *Update on reload* (หรือ hard refresh `Ctrl/⌘ + Shift + R`)

## 🌐 วิธี Publish

แอปเป็น static files ล้วน — เอาโฟลเดอร์นี้ไปวางบนเว็บโฮสติ้งไหนก็ได้ที่เป็น **HTTPS** (จำเป็นสำหรับ PWA)

### GitHub Pages (ใช้อยู่ตอนนี้ — ฟรี)

**ตั้งค่าครั้งแรก (ทำไว้แล้ว)**

1. Push โค้ดขึ้น GitHub (repo ต้องเป็น Public หรือใช้ GitHub Pro สำหรับ Private)
2. ไปที่ repo → **Settings → Pages**
3. **Source:** `Deploy from a branch` → **Branch:** `main` / `(root)` → **Save**
4. รอ ~1 นาที แอปจะอยู่ที่ `https://<username>.github.io/<repo>/`

หรือใช้คำสั่ง (ต้องมี [GitHub CLI](https://cli.github.com/)):

```bash
gh api -X POST repos/<username>/<repo>/pages -f "source[branch]=main" -f "source[path]=/"
```

**อัปเดตเวอร์ชันใหม่ (ทุกครั้งที่แก้โค้ด)**

1. เปลี่ยน `CACHE_VERSION` ใน `sw.js` (เช่น `myday-v1.1.0` → `myday-v1.1.1`) และ `APP_VERSION` ใน `js/app.js`
   — ถ้าไม่เปลี่ยน คนที่ติดตั้งแอปไว้จะยังเห็นเวอร์ชันเก่าจากแคช
2. Commit แล้ว push:
   ```bash
   git add -A
   git commit -m "อธิบายสิ่งที่แก้"
   git push origin main
   ```
3. GitHub Pages deploy ให้อัตโนมัติ ดูสถานะได้ที่แท็บ **Actions** หรือ `gh api repos/<username>/<repo>/pages --jq .status` (ได้ `built` = เสร็จ)
4. ผู้ใช้จะได้เวอร์ชันใหม่เมื่อเปิดแอปครั้งถัดไป (แอปจะแจ้ง "มีเวอร์ชันใหม่")

### ทางเลือกอื่น (ฟรีเหมือนกัน)

| บริการ | วิธี |
|--------|------|
| **Netlify** | ลากโฟลเดอร์ไปวางที่ [app.netlify.com/drop](https://app.netlify.com/drop) หรือเชื่อม GitHub repo (Build command: เว้นว่าง, Publish directory: `.`) |
| **Vercel** | [vercel.com/new](https://vercel.com/new) → Import repo → Framework: *Other* → Deploy |
| **Cloudflare Pages** | Dashboard → Workers & Pages → Create → Pages → เชื่อม repo (Build command: เว้นว่าง, Output: `/`) |

> ใช้โดเมนของตัวเองได้ทุกบริการ (GitHub Pages: Settings → Pages → Custom domain)

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
