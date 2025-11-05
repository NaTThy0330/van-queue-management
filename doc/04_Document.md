# Van Queue & Departure System – Functional Requirements (MVP)

## 1. Overview

This document lists the **functional requirements** of the MVP version of the Van Queue & Departure System.  
Each requirement corresponds to one major feature or user capability, mapped to use cases from the original project documentation (Chapter 3).

Each requirement includes:
- **ID** — Reference code for tracking
- **Description** — Expected behavior or user goal
- **Acceptance Criteria** — Minimal condition for completion
- **Related Role** — Who can perform the action

---

## 2. Passenger Module

### REQ-01: Passenger Registration & Login
**Description:**  
Allow new passengers to create an account and existing ones to log in using email and password.  

**Acceptance Criteria:**  
- A passenger can register with unique email and phone.  
- Passwords are hashed.  
- Successful login returns JWT token.  

**Related Role:** Passenger  

---

### REQ-02: View Available Routes
**Description:**  
Passenger can view all available van routes (origin–destination pairs).  

**Acceptance Criteria:**  
- Display list of routes fetched from `/api/routes`.  
- Each route shows origin, destination, and distance.  

**Related Role:** Passenger  

---

### REQ-03: View Available Trips
**Description:**  
Passenger can view trip schedules for a specific route.  

**Acceptance Criteria:**  
- Trips display departure time and seat availability.  
- Data fetched from `/api/routes/:id/trips`.  

**Related Role:** Passenger  

---

### REQ-04: Reserve a Queue
**Description:**  
Passenger can book or reserve a seat (queue) for a selected trip and upload payment slip.  

**Acceptance Criteria:**  
- Uploads slip via `/api/queue/reserve`.  
- Queue status = “pending_verification”.  
- Passenger receives confirmation notification.  

**Related Role:** Passenger  

---

### REQ-05: Check Queue Status
**Description:**  
Passenger can check the reservation status (pending, confirmed, cancelled).  

**Acceptance Criteria:**  
- Data visible from `/api/queue/status`.  
- Displays seat number and departure time if confirmed.  

**Related Role:** Passenger  

---

### REQ-06: View Ticket History
**Description:**  
Passenger can see past trip records and status.  

**Acceptance Criteria:**  
- Lists all completed trips.  
- Each record includes route, date, and status.  

**Related Role:** Passenger  

---

### REQ-07: Receive Notifications
**Description:**  
Passenger receives push notifications for payment approval, departure reminders, and van departure events.  

**Acceptance Criteria:**  
- Notifications sent via Firebase FCM.  
- At least three triggers: payment verified, 15-min reminder, van departed.  

**Related Role:** Passenger  

---

### REQ-08: View Lost & Found Items
**Description:**  
Passenger can view lost & found items posted by drivers.  

**Acceptance Criteria:**  
- Endpoint `/api/lostfound` returns list with item, date, and driver name.  

**Related Role:** Passenger  

---

## 3. Driver Module

### REQ-09: View Assigned Queues
**Description:**  
Driver can view all queues associated with their assigned van and trip.  

**Acceptance Criteria:**  
- Endpoint `/driver/trips/:id/queues`.  
- Displays passenger name, payment status, seat number.  

**Related Role:** Driver  

---

### REQ-10: Verify Payment Slips
**Description:**  
Driver verifies payment proof uploaded by passengers.  

**Acceptance Criteria:**  
- Endpoint `/driver/payments/:id/verify`.  
- Updates payment status = “verified”.  
- Sends FCM notification to passenger.  

**Related Role:** Driver  

---

### REQ-11: Confirm Van Departure
**Description:**  
Driver confirms that the van has departed for a scheduled trip.  

**Acceptance Criteria:**  
- Endpoint `/driver/departure/:trip_id`.  
- Trip status changes to “departed”.  
- Broadcast real-time event `trip:departure` via Socket.IO.  

**Related Role:** Driver  

---

### REQ-12: Post Lost & Found Item
**Description:**  
Driver can submit details of lost items found in the van.  

**Acceptance Criteria:**  
- Endpoint `/driver/lostfound`.  
- Data stored and visible to all passengers.  

**Related Role:** Driver  

---

## 4. Admin Module

### REQ-13: Manage Routes
**Description:**  
Admin can add new van routes (origin–destination pairs).  

**Acceptance Criteria:**  
- Endpoint `/admin/route`.  
- Must prevent duplicate routes.  

**Related Role:** Admin  

---

### REQ-14: Manage Vans
**Description:**  
Admin can register van details and assign drivers.  

**Acceptance Criteria:**  
- Endpoint `/admin/van`.  
- Validates unique plate number.  

**Related Role:** Admin  

---

### REQ-15: Manage Drivers
**Description:**  
Admin can register driver information.  

**Acceptance Criteria:**  
- Endpoint `/admin/driver`.  
- Validates unique license number.  

**Related Role:** Admin  

---

### REQ-16: View Dashboard Summary
**Description:**  
Admin can view overall system statistics (total vans, drivers, trips, pending queues).  

**Acceptance Criteria:**  
- Endpoint `/admin/dashboard`.  
- Displays real-time summary counts.  

**Related Role:** Admin  

---

## 5. System / Infrastructure Requirements

### REQ-17: Authentication & Authorization
**Description:**  
System must protect all endpoints using JWT authentication and role-based access control.  

**Acceptance Criteria:**  
- JWT required for any non-public API.  
- Roles: Passenger, Driver, Admin.  
- Unauthorized access returns 401.  

**Related Role:** System  

---

### REQ-18: Real-Time Communication
**Description:**  
System uses Socket.IO to broadcast queue updates and departure notifications.  

**Acceptance Criteria:**  
- Emit events: `queue:update`, `trip:departure`, `payment:verified`.  
- Both passenger and driver clients receive updates instantly.  

**Related Role:** System  

---

### REQ-19: Notification Delivery
**Description:**  
Integrate Firebase Cloud Messaging (FCM) for push notifications to mobile browsers.  

**Acceptance Criteria:**  
- FCM tokens registered per user.  
- Notification content dynamic based on event.  

**Related Role:** System  

---

### REQ-20: Data Storage & Schema
**Description:**  
System stores all persistent data in MongoDB Atlas using Mongoose schemas.  

**Acceptance Criteria:**  
- 9 core collections defined (Passenger, Driver, Van, Route, Trip, Queue, Payment, TicketHistory, LocationUpdate).  
- Each collection has validation and unique index as specified in Database Design doc.  

**Related Role:** System  

---

### REQ-21: Security & Validation
**Description:**  
System ensures input validation, password encryption, and CORS control.  

**Acceptance Criteria:**  
- bcrypt for password hashing.  
- Joi/Zod schema validation.  
- CORS restricted to production origin.  

**Related Role:** System  

---

## 6. Non-Functional (Supporting MVP)

| ID | Requirement | Acceptance Criteria |
|----|--------------|---------------------|
| NFR-01 | Response time | < 2s average for main APIs |
| NFR-02 | Availability | 95% uptime during testing period |
| NFR-03 | Usability | Basic responsive layout for mobile web |
| NFR-04 | Data security | Passwords encrypted; no sensitive logs |

---

## 7. Summary Table

| Req ID | Module | Description | API Ref |
|---------|---------|-------------|----------|
| REQ-01 | Passenger | Register/Login | `/auth/register`, `/auth/login` |
| REQ-02 | Passenger | View Routes | `/routes` |
| REQ-03 | Passenger | View Trips | `/routes/:id/trips` |
| REQ-04 | Passenger | Reserve Queue | `/queue/reserve` |
| REQ-05 | Passenger | Check Queue | `/queue/status` |
| REQ-06 | Passenger | Ticket History | `/tickets/history` |
| REQ-07 | Passenger | Notifications | FCM Events |
| REQ-08 | Passenger | Lost & Found | `/lostfound` |
| REQ-09 | Driver | View Queues | `/driver/trips/:id/queues` |
| REQ-10 | Driver | Verify Payments | `/driver/payments/:id/verify` |
| REQ-11 | Driver | Confirm Departure | `/driver/departure/:trip_id` |
| REQ-12 | Driver | Post Lost & Found | `/driver/lostfound` |
| REQ-13 | Admin | Manage Routes | `/admin/route` |
| REQ-14 | Admin | Manage Vans | `/admin/van` |
| REQ-15 | Admin | Manage Drivers | `/admin/driver` |
| REQ-16 | Admin | Dashboard | `/admin/dashboard` |
| REQ-17 | System | JWT Auth | Middleware |
| REQ-18 | System | Socket.IO | Event system |
| REQ-19 | System | FCM Integration | Firebase SDK |
| REQ-20 | System | MongoDB Schema | Mongoose |
| REQ-21 | System | Validation & Security | Middleware |

---

**End of Document**
