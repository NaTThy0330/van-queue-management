# Van Queue & Departure System – Database Design (MVP)

## 1. Overview

This document describes the **MongoDB data model** used in the MVP of the Van Queue & Departure System.  
All data entities are represented as collections with references via `ObjectId`.  
The schema focuses on core functionality only — queue reservation, trip tracking, payment, and notification.

---

## 2. Entity Overview

| Collection | Purpose |
|-------------|----------|
| **passengers** | Passenger user accounts |
| **drivers** | Van driver accounts |
| **vans** | Vehicle information |
| **routes** | Origin–destination definitions |
| **trips** | Trip instances per day |
| **queues** | Passenger queue and reservation data |
| **payments** | Uploaded payment slip and verification info |
| **ticket_history** | Passenger travel history |
| **location_updates** | Real-time GPS location of vans |

---

## 3. Collection Schemas

### 3.1 passengers
```js
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: { type: String, unique: true },
  password_hash: String,
  role: { type: String, enum: ["passenger"], default: "passenger" },
  created_at: { type: Date, default: Date.now }
}

Index: email (unique)

Validation: Require name, email, password_hash

### 3.2 drivers
{
  _id: ObjectId,
  name: String,
  phone: String,
  license_no: { type: String, unique: true },
  assigned_van: ObjectId, // ref: vans
  role: { type: String, enum: ["driver"], default: "driver" },
  created_at: { type: Date, default: Date.now }
}


Index: license_no (unique)

Validation: Require name, phone, license_no

### 3.3 vans
{
  _id: ObjectId,
  plate_number: { type: String, unique: true },
  model: String,
  seat_capacity: Number,
  driver_id: ObjectId, // ref: drivers
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}


Relation: 1 Driver → 1 Van

Index: plate_number (unique)

### 3.4 routes
{
  _id: ObjectId,
  origin: String,
  destination: String,
  distance_km: Number
}


Sample:

{ "origin": "Thammasat", "destination": "Victory Monument", "distance_km": 40 }

### 3.5 trips
{
  _id: ObjectId,
  route_id: ObjectId, // ref: routes
  van_id: ObjectId,   // ref: vans
  depart_time: Date,
  status: { type: String, enum: ["scheduled", "departed", "completed"], default: "scheduled" }
}


Used for each day’s trip schedule

Index: route_id, depart_time

### 3.6 queues
{
  _id: ObjectId,
  passenger_id: ObjectId, // ref: passengers
  trip_id: ObjectId,      // ref: trips
  payment_id: ObjectId,   // ref: payments
  queue_type: { type: String, enum: ["normal", "standby"], default: "normal" },
  seat_no: Number,
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  created_at: { type: Date, default: Date.now }
}


Relation: Many Queues → One Trip

Validation: Require passenger_id, trip_id

### 3.7 payments
{
  _id: ObjectId,
  queue_id: ObjectId,   // ref: queues
  amount: Number,
  slip_url: String,
  status: { type: String, enum: ["waiting", "verified", "rejected"], default: "waiting" },
  verified_by: ObjectId, // ref: drivers
  created_at: { type: Date, default: Date.now }
}


Relation: 1 Queue ↔ 1 Payment

Index: status

### 3.8 ticket_history
{
  _id: ObjectId,
  passenger_id: ObjectId,
  trip_id: ObjectId,
  queue_id: ObjectId,
  ticket_code: String,
  issued_at: { type: Date, default: Date.now }
}


Automatically generated when passenger check-in or trip completes

### 3.9 location_updates
{
  _id: ObjectId,
  trip_id: ObjectId, // ref: trips
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now }
}


Used for real-time van tracking

TTL index (expireAfterSeconds) optional for cleanup (e.g., 7 days)

## 4. Relationships Diagram (ERD)
erDiagram
  PASSENGERS ||--o{ QUEUES : books
  DRIVERS ||--o{ VANS : operates
  VANS ||--o{ TRIPS : assigned_to
  ROUTES ||--o{ TRIPS : contains
  TRIPS ||--o{ QUEUES : has
  QUEUES ||--o{ PAYMENTS : has
  PASSENGERS ||--o{ TICKET_HISTORY : keeps
  TRIPS ||--o{ LOCATION_UPDATES : updates

## 5. Example Data (Seed Script)
db.routes.insertMany([
  { origin: "Thammasat", destination: "Victory Monument", distance_km: 40 },
  { origin: "Thammasat", destination: "Chatuchak", distance_km: 35 },
  { origin: "Thammasat", destination: "Future Park", distance_km: 15 }
]);

db.vans.insertOne({
  plate_number: "ขข-2025",
  model: "Toyota Commuter",
  seat_capacity: 13,
  status: "active"
});

db.drivers.insertOne({
  name: "Narin Wong",
  phone: "0899999999",
  license_no: "D1234567"
});

## 6. Index Plan Summary
| Collection       | Indexed Fields          | Purpose             |
| ---------------- | ----------------------- | ------------------- |
| passengers       | email                   | unique login        |
| drivers          | license_no              | unique verification |
| vans             | plate_number, driver_id | fast lookup         |
| routes           | origin + destination    | route search        |
| trips            | route_id + depart_time  | schedule query      |
| queues           | trip_id + passenger_id  | passenger status    |
| payments         | queue_id + status       | quick verify        |
| ticket_history   | passenger_id            | fetch history       |
| location_updates | trip_id                 | live tracking       |

## 7. Data Validation Rules
| Field         | Validation                 | Description           |
| ------------- | -------------------------- | --------------------- |
| email         | Must be valid email format | Passenger login       |
| phone         | 10 digits numeric          | Contact info          |
| amount        | > 0 number                 | Payment value         |
| status (enum) | strict to allowed values   | Prevent invalid state |

## 8. Notes for Implementation

Use Mongoose ODM for schema modeling.

Define ref relations for population (.populate()).

Use pre('save') hooks for password hashing (bcrypt).

Implement validation middleware for required fields.

Store payment slips in Firebase Storage or Cloudinary.

Optional TTL index for location_updates cleanup.

## 9. Summary
| Layer              | Description                                         |
| ------------------ | --------------------------------------------------- |
| Database Type      | MongoDB Atlas (NoSQL)                               |
| ORM                | Mongoose                                            |
| Total Collections  | 9                                                   |
| Relationship Style | Reference (ObjectId)                                |
| Core Entities      | Passenger, Driver, Van, Route, Trip, Queue, Payment |
| Optional Entities  | Ticket History, Location Updates                    |
