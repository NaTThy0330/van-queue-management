## ⚙️ 3. ระยะพัฒนา (Development Phase)
### 3.1 Setup Environment

แยก repo เป็น 2 ส่วน (เช่น vanqueue-client, vanqueue-server)

ใช้ GitHub + Git Branch Flow:

main (stable)

dev (integration)

feature/* (แต่ละ use case)

เขียน .env.example สำหรับทุก service

### 3.2 Backend (Node/Express)

แบ่ง Module ตาม Domain:
/routes, /controllers, /models, /middlewares

ใช้ JWT Auth + Middleware role-based

เชื่อม MongoDB Atlas

ใช้ Socket.IO สำหรับ update queue real-time

แยก config Google Maps API, Firebase FCM ออกเป็น service file

### 3.3 Frontend (React)

วางโครงสร้างเป็น Component-based

ใช้ React Router สำหรับหน้าหลัก

ใช้ Redux / Zustand สำหรับ state queue / user

Integrate Socket.IO client สำหรับ queue real-time update

### 3.4 Collaboration Best Practice

PR Review กันทุก feature

ใช้ Commit Convention (เช่น feat:, fix:, refactor:)

ใช้ ESLint + Prettier auto-format

ตั้ง GitHub Project Board Sync กับ Trello