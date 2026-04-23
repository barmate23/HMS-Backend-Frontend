# HMS Phase 1 Backend Blueprint (Core Foundation)

## 1) Purpose
This document defines the **minimum backend architecture and API contract** needed to support your current HMS frontend and to prepare for future channel API integration (e.g., Channex).

Phase 1 scope covers only the internal hotel engine:
- Property Management
- Room Management
- Reservation Engine
- Availability Engine
- Rate Management
- Guest Profile
- Housekeeping
- Billing / Folio
- Inventory Calendar

---

## 2) Frontend-Informed Requirements (from your current project)
Your current frontend models and screens already imply a strong backend contract:

- Arrivals requires booking source, ETA, room assignment, guest identity checks, and payment progress.
- Departures requires checkout workflow, billing items, room audit, and final balance.
- Guest Profiles requires identity, preferences, documents, notes, stay history, and billing history.
- Room Rack requires room status timeline, housekeeping state, maintenance blocks, and assignment windows.

Because of this, backend services should be event-driven around reservation lifecycle changes (booked, checked-in, checked-out, cancelled, no-show) and room state transitions (vacant clean/dirty, occupied, out-of-order).

---

## 3) Target Architecture (Phase 1)
Use a **modular monolith** first (faster to deliver, easier transactional consistency), with module boundaries that can later split into microservices.

### 3.1 Logical Modules
1. `property-service`
2. `room-inventory-service`
3. `reservation-service`
4. `availability-service`
5. `rate-service`
6. `guest-service`
7. `housekeeping-service`
8. `folio-billing-service`
9. `calendar-service`
10. `integration-outbox` (for future channel sync)

### 3.2 Core Technical Choices
- REST APIs (JSON), versioned under `/api/v1`
- PostgreSQL as source of truth
- Redis cache for availability/rate lookups
- Message/outbox table for async events (`reservation.created`, `room.status.changed`, etc.)
- JWT auth + property-scoped RBAC
- UTC timestamps in DB; property timezone stored per hotel

---

## 4) Domain Model (Minimum Tables)

### 4.1 Property Management
- `properties`
  - `id`, `code`, `name`, `timezone`, `currency`, `address`, `status`
- `users`
  - `id`, `email`, `name`, `status`
- `property_users`
  - `property_id`, `user_id`, `role` (admin, front_desk, hk_manager, accountant)

### 4.2 Room Management
- `room_types`
  - `id`, `property_id`, `code`, `name`, `base_occupancy`, `max_occupancy`, `description`
- `rooms`
  - `id`, `property_id`, `room_type_id`, `room_number`, `floor`, `status` (vacant_clean, vacant_dirty, occupied, ooo, maintenance)
- `room_features`
  - `id`, `property_id`, `name`
- `room_feature_map`
  - `room_id`, `feature_id`
- `room_blocks`
  - `id`, `property_id`, `room_id`, `block_type`, `start_date`, `end_date`, `reason`, `status`

### 4.3 Reservation + Availability + Inventory Calendar
- `reservations`
  - `id`, `property_id`, `confirmation_no`, `status`, `source`, `rate_plan_id`, `check_in`, `check_out`, `adults`, `children`, `total_amount`, `balance_due`, `booked_at`
- `reservation_rooms`
  - `id`, `reservation_id`, `room_type_id`, `room_id (nullable until assign)`, `nightly_rate`, `tax_amount`
- `inventory_calendar`
  - `id`, `property_id`, `stay_date`, `room_type_id`, `total_rooms`, `sold_rooms`, `blocked_rooms`, `out_of_order_rooms`, `available_rooms`
- `availability_holds`
  - `id`, `property_id`, `room_type_id`, `check_in`, `check_out`, `qty`, `expires_at`, `channel`

### 4.4 Rate Management
- `rate_plans`
  - `id`, `property_id`, `code`, `name`, `meal_plan`, `cancellation_policy`, `active`
- `rate_plan_rules`
  - `id`, `rate_plan_id`, `min_los`, `max_los`, `cta`, `ctd`, `advance_booking_days`
- `daily_rates`
  - `id`, `property_id`, `rate_plan_id`, `room_type_id`, `stay_date`, `single_rate`, `double_rate`, `extra_adult_rate`, `extra_child_rate`, `currency`

### 4.5 Guest Profile
- `guests`
  - `id`, `property_id`, `first_name`, `last_name`, `dob`, `gender`, `nationality`, `email`, `phone`, `language`, `guest_type`
- `guest_addresses`
  - `guest_id`, `line1`, `city`, `country`, `postal_code`
- `guest_documents`
  - `id`, `guest_id`, `doc_type`, `doc_no`, `issued_country`, `expiry_date`, `file_url`
- `guest_preferences`
  - `id`, `guest_id`, `category`, `value`
- `guest_notes`
  - `id`, `guest_id`, `staff_id`, `note`, `is_pinned`

### 4.6 Housekeeping
- `housekeeping_tasks`
  - `id`, `property_id`, `room_id`, `task_type`, `priority`, `status`, `assigned_to`, `due_at`, `completed_at`
- `room_status_history`
  - `id`, `property_id`, `room_id`, `old_status`, `new_status`, `changed_by`, `changed_at`, `reason`

### 4.7 Billing / Folio
- `folios`
  - `id`, `property_id`, `reservation_id`, `guest_id`, `status` (open, closed, disputed)
- `folio_lines`
  - `id`, `folio_id`, `posting_date`, `category` (room, food, service, tax, payment, refund, damage, other), `description`, `debit`, `credit`
- `payments`
  - `id`, `folio_id`, `amount`, `method`, `txn_ref`, `status`, `paid_at`
- `invoices`
  - `id`, `folio_id`, `invoice_no`, `issued_at`, `subtotal`, `tax_total`, `grand_total`

### 4.8 Future Integration Readiness (critical now)
- `external_mappings`
  - `id`, `property_id`, `provider` (channex), `entity_type` (room_type, rate_plan, reservation), `internal_id`, `external_id`
- `outbox_events`
  - `id`, `aggregate_type`, `aggregate_id`, `event_type`, `payload_json`, `status`, `retry_count`, `next_retry_at`

---

## 5) API Contract (Phase 1 Baseline)

### 5.1 Property
- `POST /api/v1/properties`
- `GET /api/v1/properties/{propertyId}`
- `GET /api/v1/properties/{propertyId}/users`
- `POST /api/v1/properties/{propertyId}/users`

### 5.2 Rooms / Room Types / Blocks
- `POST /api/v1/properties/{propertyId}/room-types`
- `GET /api/v1/properties/{propertyId}/room-types`
- `POST /api/v1/properties/{propertyId}/rooms`
- `GET /api/v1/properties/{propertyId}/rooms?status=&floor=&type=`
- `PATCH /api/v1/properties/{propertyId}/rooms/{roomId}/status`
- `POST /api/v1/properties/{propertyId}/rooms/{roomId}/blocks`

### 5.3 Availability + Inventory Calendar
- `GET /api/v1/properties/{propertyId}/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&roomTypeId=&qty=`
- `POST /api/v1/properties/{propertyId}/availability/hold`
- `DELETE /api/v1/properties/{propertyId}/availability/hold/{holdId}`
- `GET /api/v1/properties/{propertyId}/inventory-calendar?from=&to=&roomTypeId=`

### 5.4 Rates
- `POST /api/v1/properties/{propertyId}/rate-plans`
- `GET /api/v1/properties/{propertyId}/rate-plans`
- `PUT /api/v1/properties/{propertyId}/daily-rates/bulk`
- `GET /api/v1/properties/{propertyId}/daily-rates?from=&to=&roomTypeId=&ratePlanId=`

### 5.5 Reservations
- `POST /api/v1/properties/{propertyId}/reservations`
- `GET /api/v1/properties/{propertyId}/reservations?status=&from=&to=&source=`
- `GET /api/v1/properties/{propertyId}/reservations/{reservationId}`
- `PATCH /api/v1/properties/{propertyId}/reservations/{reservationId}`
- `POST /api/v1/properties/{propertyId}/reservations/{reservationId}/assign-room`
- `POST /api/v1/properties/{propertyId}/reservations/{reservationId}/check-in`
- `POST /api/v1/properties/{propertyId}/reservations/{reservationId}/check-out`
- `POST /api/v1/properties/{propertyId}/reservations/{reservationId}/cancel`
- `POST /api/v1/properties/{propertyId}/reservations/{reservationId}/mark-no-show`

### 5.6 Guest Profile
- `POST /api/v1/properties/{propertyId}/guests`
- `GET /api/v1/properties/{propertyId}/guests?search=&type=`
- `GET /api/v1/properties/{propertyId}/guests/{guestId}`
- `PATCH /api/v1/properties/{propertyId}/guests/{guestId}`
- `POST /api/v1/properties/{propertyId}/guests/{guestId}/documents`
- `POST /api/v1/properties/{propertyId}/guests/{guestId}/notes`

### 5.7 Housekeeping
- `GET /api/v1/properties/{propertyId}/housekeeping/tasks?status=&assignee=`
- `POST /api/v1/properties/{propertyId}/housekeeping/tasks`
- `PATCH /api/v1/properties/{propertyId}/housekeeping/tasks/{taskId}`
- `POST /api/v1/properties/{propertyId}/housekeeping/tasks/{taskId}/complete`

### 5.8 Billing / Folio
- `GET /api/v1/properties/{propertyId}/folios/{folioId}`
- `POST /api/v1/properties/{propertyId}/folios/{folioId}/lines`
- `POST /api/v1/properties/{propertyId}/folios/{folioId}/payments`
- `POST /api/v1/properties/{propertyId}/folios/{folioId}/close`
- `GET /api/v1/properties/{propertyId}/reservations/{reservationId}/invoice`

---

## 6) Critical Workflows

### Workflow A — Create Booking
1. Validate guest, dates, occupancy.
2. Query availability engine.
3. Create short hold (e.g., 10 min).
4. Price using rate plan + daily rates.
5. Create reservation + reservation_rooms.
6. Deduct sold inventory in `inventory_calendar` for each stay date.
7. Emit `reservation.created` outbox event.
8. Create folio shell (open).

### Workflow B — Check-In
1. Verify reservation status = confirmed/pre-assigned.
2. Assign room if null.
3. Update reservation status to checked-in.
4. Update room status to occupied.
5. Append room status history.
6. Post advance payment to folio if received.
7. Emit `reservation.checked_in` and `room.status.changed`.

### Workflow C — Check-Out
1. Validate pending charges.
2. Settle folio balance (payment/refund).
3. Close folio + generate invoice.
4. Update reservation status checked-out.
5. Update room status vacant_dirty (housekeeping queue trigger).
6. Emit `reservation.checked_out` + `housekeeping.task.created`.

---

## 7) Availability Calculation Rules
For each `room_type` and `stay_date`:

`available = total_rooms - sold_rooms - blocked_rooms - out_of_order_rooms`

Rules:
- Exclude cancelled and no-show from sold rooms (based on policy/time cutoffs).
- Hold inventory reduces sellable count until expiry.
- Room-level maintenance block increments `out_of_order_rooms`.
- CTA/CTD/minLOS/maxLOS are validated by rate rules before reservation confirm.

---

## 8) Validation & Business Rules (Must Have)
- Multi-property data isolation by `property_id` in every table/query.
- No overlapping active room assignment for same room/date range.
- `check_out` must be strictly greater than `check_in`.
- Currency locked per property; rate and folio currency must match.
- Every reservation must have at least one guest link and one room-type line.
- All status changes must be auditable (`who`, `when`, `why`).

---

## 9) Security, Audit, and Reliability
- RBAC by module action (`reservation:create`, `housekeeping:update`, etc.)
- Idempotency key support for create booking/check-in/payment APIs.
- Optimistic locking on reservation + inventory rows.
- Outbox pattern to avoid lost integration events.
- Soft delete for master data (room type, rate plans), never hard delete transactional rows.
- PII encryption at rest for guest docs/identifiers.

---

## 10) Phase 1 Delivery Plan (Recommended)

### Sprint 1 (Foundation)
- Property, Room Types, Rooms, Reservation CRUD
- Inventory calendar population job
- Basic availability API

### Sprint 2 (Operations)
- Check-in/check-out flows
- Housekeeping task engine
- Guest profiles + notes + documents

### Sprint 3 (Revenue)
- Rate plans + daily rates + restrictions
- Folio lines, payments, invoice generation

### Sprint 4 (Integration-ready hardening)
- Outbox events + external mappings
- Idempotency, audit logs, retries
- API docs (OpenAPI) for future channel manager adapter

---

## 11) Channex-Ready Design Decisions (Do This Now)
To ensure smooth channel integration later:
1. Keep separate internal IDs and external mapping table.
2. Maintain event stream for reservation/rate/inventory changes.
3. Support bulk inventory/rate updates by date range.
4. Normalize booking sources (`direct`, `ota`, `walk_in`, `corporate`).
5. Add webhook receiver framework (signature verification + replay protection).

---

## 12) Suggested Next Implementation Artifacts
Create these immediately after this blueprint:
1. `openapi/hms-v1.yaml` (full request/response contract)
2. `db/migrations/001_phase1_core.sql`
3. `db/migrations/002_rates_inventory.sql`
4. `db/migrations/003_folio_housekeeping.sql`
5. `docs/event-catalog.md` (all outbox events with payload schema)

This gives you a production-aligned backend base where OTA/channel integration becomes an adapter layer, not a rewrite.
