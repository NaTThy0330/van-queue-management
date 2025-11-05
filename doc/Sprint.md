เยี่ยมมากครับ ✅
ต่อไปนี้คือชุด **Backlog ฉบับเต็ม (พร้อม Subtask)**
ที่คุณสามารถนำเข้า Jira หรือสร้างบอร์ด Sprint ได้เลย
ผมจะเขียนในรูปแบบ dev-friendly — 1 Story ต่อ Feature พร้อม Subtasks (Frontend + Backend + Integration + Testing)

---

# 🧩 Jira Backlog — Van Queue & Departure System (MVP)

---

## 🟦 Epic: Passenger Module (VANQ-EP01)

| Story ID    | Title                          | Sub-Tasks                                                                                                                                                                                                                                                                                                        |
| ----------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VANQ-01** | Passenger Registration & Login | 1️⃣ Create registration/login UI (React) <br>2️⃣ Build `/auth/register` & `/auth/login` endpoints (Express) <br>3️⃣ Implement JWT auth & role middleware <br>4️⃣ Connect frontend form to backend API (Axios) <br>5️⃣ Add validation (email unique, password length) <br>6️⃣ Manual test registration/login flow |
| **VANQ-02** | View Available Routes          | 1️⃣ Create Route List page (React) <br>2️⃣ Implement `/routes` API endpoint (GET) <br>3️⃣ Display origin/destination in table <br>4️⃣ Add loading/error states <br>5️⃣ Test API integration                                                                                                                      |
| **VANQ-03** | View Available Trips           | 1️⃣ Add Trip List component (filtered by route) <br>2️⃣ Implement `/routes/:id/trips` endpoint <br>3️⃣ Show depart time + van info <br>4️⃣ Test date/time formatting <br>5️⃣ Verify data linking route → trips                                                                                                   |
| **VANQ-04** | Reserve Queue                  | 1️⃣ Build booking form + payment slip upload (React) <br>2️⃣ Implement `/queue/reserve` (POST) with file upload (Multer) <br>3️⃣ Store payment + queue in DB <br>4️⃣ Connect frontend to API <br>5️⃣ Integrate FCM “Reservation Confirmed” <br>6️⃣ Test end-to-end booking flow                                  |
| **VANQ-05** | Check Queue Status             | 1️⃣ Create “My Queue” status page (React) <br>2️⃣ Implement `/queue/status` API <br>3️⃣ Add Socket.IO listener for queue:update <br>4️⃣ Test state update & real-time refresh                                                                                                                                    |
| **VANQ-06** | View Ticket History            | 1️⃣ Build “Ticket History” page <br>2️⃣ Implement `/tickets/history` endpoint <br>3️⃣ Format trip list (route + date + status) <br>4️⃣ Verify DB seed data and display logic                                                                                                                                     |
| **VANQ-07** | Receive Notifications          | 1️⃣ Setup FCM service worker on frontend <br>2️⃣ Implement backend push trigger (FCM SDK) <br>3️⃣ Test events: payment verified, 15-min reminder, departure <br>4️⃣ Verify notification UI & browser permission                                                                                                  |
| **VANQ-08** | View Lost & Found              | 1️⃣ Create Lost & Found page (React) <br>2️⃣ Implement `/lostfound` endpoint (GET) <br>3️⃣ Display list of items with driver info <br>4️⃣ Test data retrieval from DB                                                                                                                                            |

---

## 🟩 Epic: Driver Module (VANQ-EP02)

| Story ID    | Title                  | Sub-Tasks                                                                                                                                                                                                                       |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VANQ-09** | View Assigned Queues   | 1️⃣ Create Driver Dashboard (React) <br>2️⃣ Implement `/driver/trips/:id/queues` API <br>3️⃣ Show passenger name, seat, payment status <br>4️⃣ Add Socket.IO listener for queue updates <br>5️⃣ Test real-time data accuracy    |
| **VANQ-10** | Verify Payment Slips   | 1️⃣ Build “Payment Verification” table <br>2️⃣ Implement `/driver/payments/:id/verify` (PATCH) <br>3️⃣ Update queue + payment status in DB <br>4️⃣ Send FCM notification to passenger <br>5️⃣ Test end-to-end slip verification |
| **VANQ-11** | Confirm Van Departure  | 1️⃣ Add “Depart Now” button (React) <br>2️⃣ Implement `/driver/departure/:trip_id` (PATCH) <br>3️⃣ Update trip status = departed <br>4️⃣ Emit `trip:departure` event via Socket.IO <br>5️⃣ Trigger passenger notification (FCM) |
| **VANQ-12** | Post Lost & Found Item | 1️⃣ Create “Report Lost Item” form <br>2️⃣ Implement `/driver/lostfound` (POST) <br>3️⃣ Save item info to DB <br>4️⃣ Verify visibility on passenger UI (shared collection) <br>5️⃣ Test submission & retrieval flow             |

---

## 🟧 Epic: Admin Module (VANQ-EP03)

| Story ID    | Title                  | Sub-Tasks                                                                                                                                                                                                        |
| ----------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VANQ-13** | Manage Routes          | 1️⃣ Build “Route Management” page <br>2️⃣ Implement `/admin/route` (POST) <br>3️⃣ Add validation (no duplicate origin–destination) <br>4️⃣ Create edit/delete actions (optional) <br>5️⃣ Test CRUD functionality |
| **VANQ-14** | Manage Vans            | 1️⃣ Create “Van Management” UI (React) <br>2️⃣ Implement `/admin/van` (POST) <br>3️⃣ Validate unique plate number <br>4️⃣ Add dropdown for driver assignment <br>5️⃣ Test DB relation driver↔van                 |
| **VANQ-15** | Manage Drivers         | 1️⃣ Build “Driver Management” page <br>2️⃣ Implement `/admin/driver` (POST) <br>3️⃣ Validate unique license number <br>4️⃣ Display driver list with assigned vans <br>5️⃣ Test data linkage                      |
| **VANQ-16** | View Dashboard Summary | 1️⃣ Create Admin Dashboard UI <br>2️⃣ Implement `/admin/dashboard` endpoint <br>3️⃣ Fetch totals: vans, drivers, trips, queues_pending <br>4️⃣ Visualize with simple chart/table <br>5️⃣ Test data accuracy      |

---

## 🟥 Epic: System / Infrastructure (VANQ-EP04)

| Story ID    | Title                          | Sub-Tasks                                                                                                                                                                                                          |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **VANQ-17** | Authentication & Authorization | 1️⃣ Create middleware for JWT verify + role check <br>2️⃣ Add `/auth/profile` endpoint <br>3️⃣ Protect all private routes <br>4️⃣ Implement role constants (PASSENGER/DRIVER/ADMIN) <br>5️⃣ Test 401/403 responses |
| **VANQ-18** | Real-Time Communication        | 1️⃣ Setup Socket.IO server (Express) <br>2️⃣ Create events: queue:update, trip:departure, payment:verified <br>3️⃣ Add frontend listeners (React context) <br>4️⃣ Test broadcast between passenger & driver        |
| **VANQ-19** | Notification Delivery          | 1️⃣ Setup Firebase FCM credentials <br>2️⃣ Create service for `sendNotification(userId, message)` <br>3️⃣ Test manual send (Postman or script) <br>4️⃣ Integrate triggers in booking/payment/departure flow        |
| **VANQ-20** | Data Storage & Schema          | 1️⃣ Define Mongoose models for all 9 collections <br>2️⃣ Implement relations & indexes <br>3️⃣ Add seed script (`seed.js`) for Route/Van/Driver data <br>4️⃣ Verify CRUD operations in MongoDB Atlas               |
| **VANQ-21** | Security & Validation          | 1️⃣ Hash passwords with bcrypt <br>2️⃣ Validate all request bodies using Joi/Zod <br>3️⃣ Configure CORS (production domain only) <br>4️⃣ Hide secrets via `.env` <br>5️⃣ Test invalid input & error handling       |

---

## 📊 Optional Non-Functional Subtasks

| Category       | Sub-Tasks                                                          |
| -------------- | ------------------------------------------------------------------ |
| **Testing**    | Create Postman collection; add unit test with Jest for controllers |
| **Deployment** | Setup Render (backend) + Vercel (frontend) pipelines               |
| **Docs**       | Link `/docs/` directory (.md files) in README                      |
| **Demo Data**  | Populate test users: Passenger x2, Driver x1, Admin x1             |
| **Sprint QA**  | Manual testing checklist per REQ-ID before sprint review           |

---

## 🧠 Recommended Sprint Distribution

| Sprint       | Focus                       | Example Stories             |
| ------------ | --------------------------- | --------------------------- |
| **Sprint 1** | Core System Setup           | VANQ-17 → VANQ-21           |
| **Sprint 2** | Passenger + Driver features | VANQ-01 → VANQ-12           |
| **Sprint 3** | Admin + Integration         | VANQ-13 → VANQ-16 + Testing |

---

## ✅ Output Summary (สำหรับ Jira Import)

| Type            | Count                    |
| --------------- | ------------------------ |
| **Epics**       | 4                        |
| **Stories**     | 21                       |
| **Sub-Tasks**   | ~95 (avg. 4–5 per story) |
| **Total Items** | ≈ 120 issues             |
