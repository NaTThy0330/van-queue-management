# Van Queue & Departure System – API Specification (MVP)

## 1. Overview

This document defines the **RESTful API design** for the MVP version of the Van Queue & Departure System.  
It covers endpoints used by three main roles — **Passenger**, **Driver**, and **Admin** — including authentication, queue management, payments, and notifications.

All APIs return JSON responses and use JWT-based authentication.

---

## 2. Base Configuration

| Property | Value |
|-----------|--------|
| **Base URL (Dev)** | `http://localhost:4000/api` |
| **Base URL (Prod)** | `https://vanqueue-backend.onrender.com/api` |
| **Content-Type** | `application/json` |
| **Auth Method** | Bearer Token (JWT) |
| **Error Format** | `{ "success": false, "message": "error detail" }` |

---

## 3. Authentication & User Management

### 3.1 Register
**POST** `/auth/register`

Create a new user account (Passenger or Driver/Admin pre-assigned manually).

#### Request
```json
{
  "name": "Somchai Jaidee",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "password": "123456",
  "role": "passenger"
}
```
#### Response
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "64cfae5b91f3a5d24ab111aa",
    "role": "passenger"
  }
}
```

### 3.2 Login

POST /auth/login

#### Request
{
  "email": "somchai@example.com",
  "password": "123456"
}

#### Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "64cfae5b91f3a5d24ab111aa",
    "name": "Somchai Jaidee",
    "role": "passenger"
  }
}

### 3.3 Get Profile

GET /auth/profile
Authorization: Bearer <token>

#### Response
{
  "success": true,
  "data": {
    "id": "64cfae5b91f3a5d24ab111aa",
    "name": "Somchai Jaidee",
    "email": "somchai@example.com",
    "role": "passenger"
  }
}

### 4. Passenger Module
### 4.1 Get Routes

GET /routes

#### Return available van routes.

{
  "success": true,
  "data": [
    { "_id": "r1", "origin": "Thammasat", "destination": "Victory Monument", "distance_km": 40 },
    { "_id": "r2", "origin": "Thammasat", "destination": "Chatuchak", "distance_km": 35 }
  ]
}

### 4.2 Get Trips by Route

GET /routes/:id/trips

{
  "success": true,
  "data": [
    {
      "_id": "t1",
      "depart_time": "2025-11-06T08:00:00Z",
      "van_id": "v1",
      "status": "scheduled"
    }
  ]
}

### 4.3 Reserve Queue

POST /queue/reserve

Passenger reserves a seat in a trip and uploads payment slip.

#### Request (multipart/form-data)
| Field        | Type         | Required | Description      |
| ------------ | ------------ | -------- | ---------------- |
| trip_id      | String       | ✅        | Trip instance ID |
| payment_slip | File (image) | ✅        | Proof of payment |
| amount       | Number       | ✅        | Payment amount   |

#### Response
{
  "success": true,
  "message": "Queue reserved successfully",
  "data": {
    "queue_id": "Q2025-001",
    "trip_id": "t1",
    "status": "pending_verification"
  }
}

### 4.4 Get Queue Status

GET /queue/status?trip_id=t1

{
  "success": true,
  "data": {
    "queue_id": "Q2025-001",
    "status": "confirmed",
    "seat_no": 5,
    "depart_time": "2025-11-06T08:00:00Z"
  }
}

### 4.5 Get Ticket History

GET /tickets/history

{
  "success": true,
  "data": [
    { "trip": "Thammasat → Chatuchak", "date": "2025-10-20", "status": "completed" },
    { "trip": "Thammasat → Victory Monument", "date": "2025-10-10", "status": "completed" }
  ]
}

### 4.6 Lost & Found

GET /lostfound

{
  "success": true,
  "data": [
    { "item": "Black Umbrella", "date": "2025-11-01", "driver": "Mr. Narin" }
  ]
}

## 5. Driver Module
### 5.1 Get Queues for Assigned Trip

GET /driver/trips/:id/queues

{
  "success": true,
  "data": [
    { "queue_id": "Q2025-001", "passenger_name": "Somchai", "payment_status": "waiting" },
    { "queue_id": "Q2025-002", "passenger_name": "Suda", "payment_status": "verified" }
  ]
}

### 5.2 Verify Payment Slip

PATCH /driver/payments/:id/verify

#### Request
{ "status": "verified" }

Response
{
  "success": true,
  "message": "Payment verified successfully"
}

### 5.3 Confirm Departure

PATCH /driver/departure/:trip_id

{
  "success": true,
  "message": "Trip marked as departed"
}


Once confirmed, the backend updates trip status and sends an FCM push notification to all passengers in that trip.

### 5.4 Create Lost & Found Entry

POST /driver/lostfound

{
  "item": "Umbrella",
  "description": "Found under seat #3",
  "trip_id": "t1"
}


#### Response:

{
  "success": true,
  "message": "Lost item recorded"
}

## 6. Admin Module
### 6.1 Add New Route

POST /admin/route

{
  "origin": "Thammasat",
  "destination": "Future Park",
  "distance_km": 15
}


#### Response:

{
  "success": true,
  "message": "Route added successfully"
}

### 6.2 Add Van

POST /admin/van

{
  "plate_number": "ขข-2025",
  "model": "Toyota Commuter",
  "seat_capacity": 13,
  "driver_id": "d1"
}


#### Response:

{ "success": true, "message": "Van registered" }

### 6.3 Add Driver

POST /admin/driver

{
  "name": "Narin Wong",
  "phone": "0899999999",
  "license_no": "D1234567"
}


#### Response:

{ "success": true, "message": "Driver added" }

### 6.4 Get Dashboard Summary

GET /admin/dashboard

{
  "success": true,
  "data": {
    "total_passengers": 120,
    "total_vans": 8,
    "today_trips": 20,
    "queues_pending": 5
  }
}

## 7. Real-Time Events (Socket.IO)
| Event              | Direction       | Payload Example                                 | Description                                     |
| ------------------ | --------------- | ----------------------------------------------- | ----------------------------------------------- |
| `queue:update`     | Server → Client | `{ "trip_id":"t1","queue_status":"confirmed" }` | Notify passengers when their queue updates      |
| `trip:departure`   | Server → Client | `{ "trip_id":"t1","status":"departed" }`        | Notify when the van departs                     |
| `payment:verified` | Server → Client | `{ "queue_id":"Q2025-001" }`                    | Notify passenger that their payment is approved |

## 8. Notifications (Firebase Cloud Messaging)
| Trigger                     | Recipient | Message Example                         |
| --------------------------- | --------- | --------------------------------------- |
| Payment verified            | Passenger | `"Your payment has been approved"`      |
| Upcoming departure (15 min) | Passenger | `"Your van will depart in 15 minutes"`  |
| Van departed                | Passenger | `"Your van has departed from terminal"` |

## 9. Error Codes
| HTTP Code | Meaning        | Example                      |
| --------- | -------------- | ---------------------------- |
| 400       | Bad Request    | Invalid or missing parameter |
| 401       | Unauthorized   | Missing or invalid token     |
| 403       | Forbidden      | Role not allowed             |
| 404       | Not Found      | Resource not found           |
| 500       | Internal Error | Unexpected server issue      |

## 10. Example Error Response
{
  "success": false,
  "message": "Unauthorized access"
}

## 11. Summary
| Module        | Key Endpoints                                                                           |
| ------------- | --------------------------------------------------------------------------------------- |
| **Auth**      | `/auth/register`, `/auth/login`, `/auth/profile`                                        |
| **Passenger** | `/routes`, `/routes/:id/trips`, `/queue/reserve`, `/queue/status`, `/tickets/history`   |
| **Driver**    | `/driver/trips/:id/queues`, `/driver/payments/:id/verify`, `/driver/departure/:trip_id` |
| **Admin**     | `/admin/route`, `/admin/van`, `/admin/driver`, `/admin/dashboard`                       |
