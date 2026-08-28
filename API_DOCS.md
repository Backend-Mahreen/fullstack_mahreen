# Mahreen Indonesia - API Documentation

## Overview

**Base URL:** `https://mahreenindonesia.com/api` (production) or `http://localhost:3000/api` (development)

**Content-Type:** `application/json`

**Authentication:** JWT Bearer Token (Access Token) + HttpOnly Cookie (Refresh Token)

---

## Table of Contents

- [Response Format](#response-format)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Public Endpoints](#public-endpoints)
- [Authenticated Endpoints](#authenticated-endpoints)
- [Client Portal Endpoints](#client-portal-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Error Codes](#error-codes)
- [Database Schema Reference](#database-schema-reference)

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasMore": true
    }
  }
}
```

---

## Authentication

### Token System

| Token Type | Expiry | Storage | Purpose |
|---|---|---|---|
| Access Token | 15 minutes | Bearer header | API requests |
| Refresh Token | 7 days (30 days with "remember") | HttpOnly cookie | Token renewal |

### Token Payload (Access Token)

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "User Name",
  "accountType": "client",
  "role": "admin",
  "permissions": ["articles.create", "users.read"],
  "jti": "unique-token-id"
}
```

### Password Policy

- Minimum 8 characters, maximum 128 characters
- At least 1 uppercase letter
- At least 1 digit
- At least 1 special character

### User Roles

| Role | Description |
|---|---|
| `superadmin` | Full access, bypasses all permission checks |
| `admin` | All permissions except `users.manage_role` and `system_reports.read` |
| `client` | Only `view_overview` permission |
| `intern` | Only `view_overview` permission |

### Permission Keys (30+)

```
articles.create, articles.read, articles.update, articles.delete
topics.create, topics.read, topics.update, topics.delete
webinars.create, webinars.read, webinars.update, webinars.delete
events.create, events.read, events.update, events.delete
products.create, products.read, products.update, products.delete
portfolios.create, portfolios.read, portfolios.update, portfolios.delete
collections.create, collections.read, collections.update, collections.delete
specializations.create, specializations.read, specializations.update, specializations.delete
consultations.create, consultations.read, consultations.update, consultations.delete
orders.create, orders.read, orders.update, orders.delete
transactions.create, transactions.read, transactions.update, transactions.delete
packages.create, packages.read, packages.update, packages.delete
campaigns.create, campaigns.read, campaigns.update, campaigns.delete, campaigns.disburse
donations.create, donations.read, donations.update, donations.delete
programs.create, programs.read, programs.update, programs.delete
pillars.create, pillars.read, pillars.update, pillars.delete
applications.create, applications.read, applications.update, applications.delete
batches.create, batches.read, batches.update, batches.delete
certificates.create, certificates.read, certificates.update, certificates.delete, certificates.issue, certificates.revoke
users.create, users.read, users.update, users.delete, users.manage_role
roles.create, roles.read, roles.update, roles.delete
analytics.read, system_reports.read
view_overview
```

---

## Rate Limiting

| Endpoint Group | Window | Max Requests | Scope |
|---|---|---|---|
| Login | 15 minutes | 8 | Per IP (failed attempts only) |
| Register | 60 minutes | 5 | Per IP |
| Refresh Token | 15 minutes | 60 | Per IP |
| Public Forms (Donations, Internships, Consultations) | 60 minutes | 20 | Per IP |
| Certificate Verification | 15 minutes | 30 | Per IP |
| Trusted Device | 15 minutes | 10 | Per IP |

---

## Public Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "StrongP@ss1",
  "fullName": "User Name",
  "accountType": "client"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "client",
    "accountType": "client",
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  }
}
```

#### Login (Client/Intern)

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "StrongP@ss1"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "client",
    "accountType": "client",
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  }
}
```

#### Login (Admin/Superadmin)

```http
POST /api/auth/admin/login
```

**Body:**

```json
{
  "email": "admin@mahreen.com",
  "password": "StrongP@ss1"
}
```

**Response (200):** Same as client login

#### Refresh Token

```http
POST /api/auth/refresh
```

**Cookie:** `refreshToken=jwt-token`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-jwt-token"
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Logout successful"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "client",
    "accountType": "client",
    "status": "active"
  }
}
```

#### Get Admin Stats

```http
GET /api/auth/admin/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalClients": 120,
    "totalAdmins": 5
  }
}
```

### Articles

#### List Articles

```http
GET /api/articles?category=tech&status=published&search=keyword&page=1&limit=20
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| category | string | Filter by category slug |
| status | string | Filter by status (published, draft, archived) |
| search | string | Search in title and content |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "slug": "article-slug",
        "title": "Article Title",
        "excerpt": "Short description...",
        "content": "Full content...",
        "category": "tech",
        "status": "published",
        "views": 150,
        "featuredImage": "https://...",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasMore": true
    }
  }
}
```

#### Get Article by Slug

```http
GET /api/articles/:slug
```

**Response (200):** Single article object

#### Get Article Stats

```http
GET /api/articles/stats
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalArticles": 50,
    "publishedCount": 45,
    "draftCount": 5,
    "totalViews": 15000
  }
}
```

### Products

#### List Products

```http
GET /api/products?category=electronics&minPrice=100&maxPrice=500&page=1&limit=20
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| category | string | Filter by category |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| search | string | Search in title |
| page | number | Page number |
| limit | number | Items per page |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "slug": "product-slug",
        "title": "Product Name",
        "price": 250000,
        "stock": 50,
        "sku": "PRD-001",
        "gallery": ["url1", "url2"],
        "soldCount": 25,
        "description": "Product description..."
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Product by Slug

```http
GET /api/products/:slug
```

### Webinars

#### List Webinars

```http
GET /api/webinars?status=upcoming&page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "slug": "webinar-slug",
        "title": "Webinar Title",
        "price": 150000,
        "isFree": false,
        "scheduleDate": "2024-06-15",
        "topics": [...],
        "mentors": [...],
        "timeline": [...]
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Webinar by Slug

```http
GET /api/webinars/:slug
```

### Events

#### List Events

```http
GET /api/events?status=upcoming&eventType=workshop&page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Event Title",
        "eventDate": "2024-06-20",
        "location": "Jakarta, Indonesia",
        "accessType": "public",
        "isFeatured": true,
        "description": "Event description..."
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Event by ID

```http
GET /api/events/:id
```

### Topics

#### List Topics

```http
GET /api/topics
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Topic Name",
      "articleCount": 10,
      "webinarCount": 5,
      "categories": [...]
    }
  ]
}
```

### Speakers

#### List Speakers

```http
GET /api/speakers?page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Speaker Name",
        "role": "CTO",
        "company": "Tech Company",
        "image": "https://..."
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Speaker by ID

```http
GET /api/speakers/:id
```

### Service Packages

#### List Service Packages

```http
GET /api/service-packages?serviceKey=consulting
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "serviceKey": "consulting",
      "tier": "basic",
      "name": "Basic Package",
      "price": 500000,
      "features": ["Feature 1", "Feature 2"]
    }
  ]
}
```

#### List Service Addons

```http
GET /api/service-packages/addons?serviceKey=consulting
```

#### List Tier Comparisons

```http
GET /api/service-packages/comparisons?serviceKey=consulting
```

### Collections

#### List Collection Cards

```http
GET /api/collections
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Collection Name",
      "layout": "grid",
      "category": "electronics",
      "sortOrder": 1
    }
  ]
}
```

#### List Specializations

```http
GET /api/collections/specializations
```

### CSR

#### List CSR Programs

```http
GET /api/csr/programs?page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Program Name",
        "category": "education",
        "budget": 50000000,
        "targetBeneficiaries": 100,
        "currentBeneficiaries": 75,
        "status": "active"
      }
    ],
    "pagination": { ... }
  }
}
```

#### List CSR Pillars

```http
GET /api/csr/pillars?page=1&limit=20
```

### Donations

#### Get Donation Summary

```http
GET /api/donations
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalCampaigns": 10,
    "totalCollected": 50000000,
    "totalDonors": 250,
    "campaigns": [...]
  }
}
```

#### Create Donation

```http
POST /api/donations
Content-Type: application/json
```

**Body:**

```json
{
  "campaignId": "uuid",
  "donorName": "Donor Name",
  "amount": 100000,
  "email": "donor@example.com",
  "isAnonymous": false,
  "message": "Keep up the good work!"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "donorName": "Donor Name",
    "amount": 100000,
    "paymentStatus": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Donation Detail

```http
GET /api/donations/:id
```

**Auth:** Owner or Admin required

### Internships

#### List Internship Batches

```http
GET /api/internships/batches?page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Batch 2024-Q1",
        "status": "open",
        "quota": 20,
        "startDate": "2024-01-15",
        "endDate": "2024-04-15",
        "mentorName": "Mentor Name"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Submit Internship Application

```http
POST /api/internships/applications
Content-Type: multipart/form-data
```

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| fullName | string | Yes |
| email | string | Yes |
| phone | string | Yes |
| university | string | Yes |
| major | string | Yes |
| batchId | string | Yes |
| specialization | string | Yes |
| motivation | string | Yes |
| cv | file | Yes (PDF, max 5MB) |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending",
    "message": "Application submitted successfully"
  }
}
```

### Newsletter

#### Subscribe

```http
POST /api/newsletter
Content-Type: application/json
```

**Body:**

```json
{
  "email": "subscriber@example.com"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "message": "Subscribed successfully"
  }
}
```

#### List Subscribers (Admin)

```http
GET /api/newsletter?page=1&limit=20
Authorization: Bearer <access-token>
```

#### Get Newsletter Stats (Admin)

```http
GET /api/newsletter/stats
Authorization: Bearer <access-token>
```

#### Remove Subscriber (Admin)

```http
DELETE /api/newsletter/:id
Authorization: Bearer <access-token>
```

### Newsroom Settings

#### Get All Settings

```http
GET /api/newsroom-settings
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "siteName": "Mahreen Indonesia",
    "contactEmail": "info@mahreen.com",
    "socialMedia": {
      "instagram": "https://instagram.com/mahreen",
      "linkedin": "https://linkedin.com/company/mahreen"
    }
  }
}
```

#### Get Single Setting

```http
GET /api/newsroom-settings/:key
```

#### Update Settings (Admin)

```http
PUT /api/newsroom-settings
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "siteName": "Mahreen Indonesia",
  "contactEmail": "info@mahreen.com"
}
```

### Categories

#### List Categories

```http
GET /api/categories
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "displayOrder": 1
    }
  ]
}
```

#### Get Category by ID

```http
GET /api/categories/:id
```

#### Create Category (Admin)

```http
POST /api/categories
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "name": "New Category",
  "displayOrder": 5
}
```

#### Update Category (Admin)

```http
PUT /api/categories/:id
Authorization: Bearer <access-token>
```

#### Delete Category (Admin)

```http
DELETE /api/categories/:id
Authorization: Bearer <access-token>
```

### Topics

#### Create Topic (Admin)

```http
POST /api/topics
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "title": "New Topic"
}
```

#### Delete Topic (Admin)

```http
DELETE /api/topics/:id
Authorization: Bearer <access-token>
```

### Speakers

#### Create Speaker (Admin)

```http
POST /api/speakers
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| name | string | Yes |
| role | string | Yes |
| company | string | Yes |
| image | file | Yes (image, max 5MB) |

#### Update Speaker (Admin)

```http
PUT /api/speakers/:id
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

#### Delete Speaker (Admin)

```http
DELETE /api/speakers/:id
Authorization: Bearer <access-token>
```

### Upload

#### Upload File

```http
POST /api/uploads
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| file | file | Yes (image or PDF, max 5MB) |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "filename": "uploaded-file.jpg"
  }
}
```

---

## Authenticated Endpoints

### Trusted Devices

#### Verify/Issue Trusted Device

```http
POST /api/auth/trusted-device/verify
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "deviceHint": "Chrome on Windows 10"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "trusted": true,
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

#### List Trusted Devices

```http
GET /api/auth/trusted-devices
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "deviceFingerprint": "hash",
      "deviceHint": "Chrome on Windows 10",
      "expiresAt": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Revoke Single Device

```http
DELETE /api/auth/trusted-devices/:id
Authorization: Bearer <access-token>
```

#### Revoke All Devices

```http
DELETE /api/auth/trusted-devices
Authorization: Bearer <access-token>
```

### Transactions

#### Get Transaction Detail

```http
GET /api/transactions/:id
Authorization: Bearer <access-token>
```

**Auth:** Owner or Admin required

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceId": "INV-2024-001",
    "clientName": "Client Name",
    "amount": 500000,
    "status": "paid",
    "paymentMethod": "bank_transfer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Client Portal Endpoints

**Base Path:** `/api/client/*`

**Auth:** Client or Intern role required

### Dashboard

#### Get Stats

```http
GET /api/client/dashboard/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "totalOrders": 10,
    "totalDonations": 3,
    "totalCertificates": 2
  }
}
```

#### Get Activities

```http
GET /api/client/dashboard/activities
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "type": "certificate",
      "title": "Certificate Issued",
      "description": "Your certificate has been issued",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Orders

```http
GET /api/client/dashboard/orders
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "serviceKey": "consulting",
      "tier": "premium",
      "totalPrice": 1500000,
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Certificates

```http
GET /api/client/dashboard/certificates
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "certificateNumber": "CERT-2024-001",
      "recipientName": "User Name",
      "programType": "internship",
      "status": "active",
      "issuedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Consultations

```http
GET /api/client/dashboard/consultations
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fullName": "User Name",
      "serviceInterest": "consulting",
      "status": "completed",
      "consultationType": "online",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Newsroom

#### Get Topics

```http
GET /api/client/newsroom
Authorization: Bearer <access-token>
```

#### Get Webinars

```http
GET /api/client/newsroom/webinars
Authorization: Bearer <access-token>
```

#### Get Events

```http
GET /api/client/newsroom/events
Authorization: Bearer <access-token>
```

### Notifications

#### List Notifications

```http
GET /api/client/notifications?page=1&limit=20
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "info",
        "title": "New Update",
        "message": "Your order has been processed",
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Unread Count

```http
GET /api/client/notifications/unread-count
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

#### Mark Notification as Read

```http
PATCH /api/client/notifications/:id/read
Authorization: Bearer <access-token>
```

#### Mark All as Read

```http
PATCH /api/client/notifications/read-all
Authorization: Bearer <access-token>
```

---

## Admin Endpoints

**Base Path:** `/api/admin/*`

**Auth:** Admin or Superadmin role required + specific permissions

### Overview

#### Get Stats

```http
GET /api/admin/overview/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalArticles": 50,
    "totalProducts": 100,
    "totalDonations": 50000000,
    "totalTransactions": 75000000,
    "pendingConsultations": 10,
    "pendingOrders": 5
  }
}
```

#### Get Monthly Revenue

```http
GET /api/admin/overview/revenue-monthly?months=12
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "month": "2024-01",
      "transactions": 5000000,
      "donations": 1000000,
      "total": 6000000
    }
  ]
}
```

#### Get Revenue by Service

```http
GET /api/admin/overview/revenue-by-service
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "serviceKey": "consulting",
      "revenue": 25000000,
      "orderCount": 50
    }
  ]
}
```

#### Get Recent Transactions

```http
GET /api/admin/overview/recent-transactions?limit=10
Authorization: Bearer <access-token>
```

#### Get Activities

```http
GET /api/admin/overview/activities?limit=20
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "type": "user_registered",
      "title": "New User Registered",
      "description": "john@example.com registered as client",
      "metadata": { "userId": "uuid" },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Audit Logs

```http
GET /api/admin/overview/audit-logs?page=1&limit=50
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "adminId": "uuid",
        "adminName": "Admin Name",
        "action": "create",
        "resource": "articles",
        "resourceId": "uuid",
        "summary": "Created article: Article Title",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Pending Queue

```http
GET /api/admin/overview/pending-queue
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "consultations": [...],
    "orders": [...],
    "donations": [...],
    "internshipApplications": [...]
  }
}
```

#### Get Growth Metrics

```http
GET /api/admin/overview/growth?period=month
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": { "current": 150, "previous": 120, "growth": 25 },
    "articles": { "current": 50, "previous": 45, "growth": 11 },
    "revenue": { "current": 6000000, "previous": 5000000, "growth": 20 }
  }
}
```

### Users

#### List Users

```http
GET /api/admin/users?role=client&status=active&page=1&limit=20
Authorization: Bearer <access-token>
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| role | string | Filter by role |
| status | string | Filter by status (active, inactive, suspended) |
| search | string | Search in name or email |
| page | number | Page number |
| limit | number | Items per page |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "User Name",
        "role": "client",
        "status": "active",
        "accountType": "client",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get User Stats

```http
GET /api/admin/users/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "byRole": { "client": 120, "admin": 5, "intern": 25 },
    "byStatus": { "active": 140, "inactive": 10 },
    "recentRegistrations": 20
  }
}
```

#### Get All Permissions

```http
GET /api/admin/users/permissions/all
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    "articles.create",
    "articles.read",
    "articles.update",
    "articles.delete"
  ]
}
```

#### Get User Detail

```http
GET /api/admin/users/:id
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "client",
    "status": "active",
    "accountType": "client",
    "permissions": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Create User

```http
POST /api/admin/users
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "email": "newuser@example.com",
  "password": "StrongP@ss1",
  "fullName": "New User",
  "role": "client",
  "accountType": "client",
  "status": "active"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "fullName": "New User"
  }
}
```

#### Update User

```http
PUT /api/admin/users/:id
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

#### Change User Status

```http
PATCH /api/admin/users/:id/status
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "status": "suspended"
}
```

#### Change User Role

```http
PATCH /api/admin/users/:id/role
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "role": "admin"
}
```

#### Check User Dependencies

```http
GET /api/admin/users/:id/dependencies
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "orders": 5,
    "donations": 3,
    "consultations": 2,
    "certificates": 1
  }
}
```

#### Delete User

```http
DELETE /api/admin/users/:id?force=true
Authorization: Bearer <access-token>
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| force | boolean | Force delete even with dependencies |

### Roles

#### List Roles

```http
GET /api/admin/roles
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Admin",
      "slug": "admin",
      "isSystem": true,
      "userCount": 5
    }
  ]
}
```

#### Get Role Stats

```http
GET /api/admin/roles/stats
Authorization: Bearer <access-token>
```

#### Get Role Select List

```http
GET /api/admin/roles/select
Authorization: Bearer <access-token>
```

#### Get All Permissions

```http
GET /api/admin/roles/permissions/all
Authorization: Bearer <access-token>
```

#### Get Role Detail

```http
GET /api/admin/roles/:id
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Admin",
    "slug": "admin",
    "isSystem": true,
    "permissions": ["articles.create", "articles.read", ...]
  }
}
```

#### Create Role

```http
POST /api/admin/roles
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "name": "Content Manager",
  "permissions": ["articles.create", "articles.read", "articles.update"]
}
```

#### Update Role

```http
PUT /api/admin/roles/:id
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "name": "Updated Role Name",
  "permissions": ["articles.create", "articles.read"]
}
```

#### Delete Role

```http
DELETE /api/admin/roles/:id
Authorization: Bearer <access-token>
```

**Note:** Cannot delete system roles

### Newsroom (Admin)

#### List Articles

```http
GET /api/admin/newsroom/articles?status=draft&page=1&limit=20
Authorization: Bearer <access-token>
```

#### Get Article Stats

```http
GET /api/admin/newsroom/articles/stats
Authorization: Bearer <access-token>
```

#### Get Article Detail

```http
GET /api/admin/newsroom/articles/:id
Authorization: Bearer <access-token>
```

#### Create Article

```http
POST /api/admin/newsroom/articles
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| title | string | Yes |
| content | string | Yes |
| category | string | Yes |
| excerpt | string | Yes |
| status | string | Yes (draft, published, archived) |
| featuredImage | file | No (image, max 5MB) |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "article-slug",
    "title": "Article Title"
  }
}
```

#### Update Article

```http
PUT /api/admin/newsroom/articles/:id
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

#### Change Article Status

```http
PATCH /api/admin/newsroom/articles/:id/status
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "status": "published"
}
```

#### Delete Article

```http
DELETE /api/admin/newsroom/articles/:id
Authorization: Bearer <access-token>
```

#### Topics (Admin)

```http
GET /api/admin/newsroom/topics
GET /api/admin/newsroom/topics/:id
POST /api/admin/newsroom/topics
PUT /api/admin/newsroom/topics/:id
DELETE /api/admin/newsroom/topics/:id
```

#### Webinars (Admin)

```http
GET /api/admin/newsroom/webinars
GET /api/admin/newsroom/webinars/stats
GET /api/admin/newsroom/webinars/:id
POST /api/admin/newsroom/webinars
PUT /api/admin/newsroom/webinars/:id
PATCH /api/admin/newsroom/webinars/:id/status
DELETE /api/admin/newsroom/webinars/:id
```

#### Events (Admin)

```http
GET /api/admin/newsroom/events
GET /api/admin/newsroom/events/stats
GET /api/admin/newsroom/events/:id
POST /api/admin/newsroom/events
PUT /api/admin/newsroom/events/:id
PATCH /api/admin/newsroom/events/:id/status
DELETE /api/admin/newsroom/events/:id
```

### Tanya Mahreen (Admin)

#### Stats

```http
GET /api/admin/tanya-mahreen/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "consultations": { "total": 100, "pending": 10, "completed": 85 },
    "orders": { "total": 50, "pending": 5, "completed": 40 },
    "transactions": { "total": 45, "paid": 40, "pending": 5 }
  }
}
```

#### Consultations

```http
GET /api/admin/tanya-mahreen/consultations?status=pending&page=1&limit=20
GET /api/admin/tanya-mahreen/consultations/:id
POST /api/admin/tanya-mahreen/consultations
PUT /api/admin/tanya-mahreen/consultations/:id
PATCH /api/admin/tanya-mahreen/consultations/:id/status
DELETE /api/admin/tanya-mahreen/consultations/:id
```

**Create Consultation Body:**

```json
{
  "userId": "uuid",
  "fullName": "Client Name",
  "email": "client@example.com",
  "phone": "+628123456789",
  "serviceInterest": "consulting",
  "consultationType": "online",
  "message": "I need help with..."
}
```

**Update Status Body:**

```json
{
  "status": "completed"
}
```

#### Orders

```http
GET /api/admin/tanya-mahreen/orders?status=pending&page=1&limit=20
GET /api/admin/tanya-mahreen/orders/:id
POST /api/admin/tanya-mahreen/orders
PUT /api/admin/tanya-mahreen/orders/:id
PATCH /api/admin/tanya-mahreen/orders/:id/status
DELETE /api/admin/tanya-mahreen/orders/:id
```

**Create Order Body:**

```json
{
  "userId": "uuid",
  "serviceKey": "consulting",
  "tier": "premium",
  "totalPrice": 1500000,
  "addons": ["addon1", "addon2"],
  "notes": "Special requirements..."
}
```

#### Transactions

```http
GET /api/admin/tanya-mahreen/transactions?status=paid&page=1&limit=20
GET /api/admin/tanya-mahreen/transactions/:id
POST /api/admin/tanya-mahreen/transactions
PUT /api/admin/tanya-mahreen/transactions/:id
PATCH /api/admin/tanya-mahreen/transactions/:id/status
DELETE /api/admin/tanya-mahreen/transactions/:id
```

**Create Transaction Body:**

```json
{
  "orderId": "uuid",
  "clientName": "Client Name",
  "amount": 1500000,
  "paymentMethod": "bank_transfer",
  "status": "paid"
}
```

**Note:** Invoice ID is auto-generated (format: `INV-YYYY-XXX`)

#### Packages

```http
GET /api/admin/tanya-mahreen/packages?serviceKey=consulting
POST /api/admin/tanya-mahreen/packages
PUT /api/admin/tanya-mahreen/packages/:id
DELETE /api/admin/tanya-mahreen/packages/:id
```

**Create Package Body:**

```json
{
  "serviceKey": "consulting",
  "tier": "basic",
  "name": "Basic Package",
  "price": 500000,
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

### Peduli Mahreen (Admin)

#### Stats

```http
GET /api/admin/peduli-mahreen/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "campaigns": { "total": 10, "active": 7, "completed": 3 },
    "donations": { "total": 250, "totalAmount": 50000000 }
  }
}
```

#### Campaigns

```http
GET /api/admin/peduli-mahreen/campaigns?page=1&limit=20
GET /api/admin/peduli-mahreen/campaigns/:id
POST /api/admin/peduli-mahreen/campaigns
PUT /api/admin/peduli-mahreen/campaigns/:id
POST /api/admin/peduli-mahreen/campaigns/:id/disburse
DELETE /api/admin/peduli-mahreen/campaigns/:id
```

**Create Campaign Body:**

```json
{
  "title": "Education Fund",
  "description": "Help underprivileged students",
  "targetAmount": 10000000,
  "category": "education",
  "status": "active"
}
```

**Disburse Funds Body:**

```json
{
  "amount": 5000000,
  "recipient": "School Name",
  "notes": "First batch disbursement"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "campaignId": "uuid",
    "disbursedAmount": 5000000,
    "remainingAmount": 5000000
  }
}
```

#### Donations

```http
GET /api/admin/peduli-mahreen/donations?status=paid&page=1&limit=20
GET /api/admin/peduli-mahreen/donations/:id
POST /api/admin/peduli-mahreen/donations
PUT /api/admin/peduli-mahreen/donations/:id
PATCH /api/admin/peduli-mahreen/donations/:id/status
DELETE /api/admin/peduli-mahreen/donations/:id
```

### CSR (Admin)

#### Stats

```http
GET /api/admin/csr/stats
Authorization: Bearer <access-token>
```

#### Programs

```http
GET /api/admin/csr/programs?page=1&limit=20
GET /api/admin/csr/programs/:id
POST /api/admin/csr/programs
PUT /api/admin/csr/programs/:id
GET /api/admin/csr/programs/:id/dependencies
DELETE /api/admin/csr/programs/:id
```

**Create Program Body:**

```json
{
  "title": "Clean Water Initiative",
  "description": "Providing clean water to rural areas",
  "category": "environment",
  "budget": 50000000,
  "targetBeneficiaries": 1000,
  "status": "active"
}
```

#### Pillars

```http
GET /api/admin/csr/pillars
POST /api/admin/csr/pillars
PUT /api/admin/csr/pillars/:id
DELETE /api/admin/csr/pillars/:id
```

#### Applications

```http
GET /api/admin/csr/applications?programId=uuid&page=1&limit=20
GET /api/admin/csr/applications/:id
POST /api/admin/csr/applications
PUT /api/admin/csr/applications/:id
PATCH /api/admin/csr/applications/:id/status
DELETE /api/admin/csr/applications/:id
```

### Studio (Admin)

#### Stats

```http
GET /api/admin/studio/stats
Authorization: Bearer <access-token>
```

#### Products

```http
GET /api/admin/studio/products?page=1&limit=20
GET /api/admin/studio/products/:id
POST /api/admin/studio/products
PUT /api/admin/studio/products/:id
PATCH /api/admin/studio/products/:id/stock
DELETE /api/admin/studio/products/:id
```

**Create Product Body:**

```json
{
  "title": "Product Name",
  "description": "Product description",
  "price": 250000,
  "stock": 50,
  "category": "electronics",
  "gallery": ["url1", "url2"]
}
```

**Note:** SKU is auto-generated (format: `PRD-XXX`)

**Update Stock Body:**

```json
{
  "stock": 45
}
```

#### Portfolios

```http
GET /api/admin/studio/portfolios?page=1&limit=20
GET /api/admin/studio/portfolios/:id
POST /api/admin/studio/portfolios
PUT /api/admin/studio/portfolios/:id
DELETE /api/admin/studio/portfolios/:id
```

**Create Portfolio Body:**

```json
{
  "title": "Project Name",
  "clientName": "Client Company",
  "description": "Project description",
  "gallery": ["url1", "url2"],
  "services": ["web-development", "ui-design"]
}
```

#### Collections

```http
GET /api/admin/studio/collections
POST /api/admin/studio/collections
PUT /api/admin/studio/collections/:id
DELETE /api/admin/studio/collections/:id
```

#### Specializations

```http
GET /api/admin/studio/specializations
POST /api/admin/studio/specializations
PUT /api/admin/studio/specializations/:id
DELETE /api/admin/studio/specializations/:id
```

### Internship (Admin)

#### Stats

```http
GET /api/admin/internship/stats
Authorization: Bearer <access-token>
```

#### Batches

```http
GET /api/admin/internship/batches?page=1&limit=20
GET /api/admin/internship/batches/:id
POST /api/admin/internship/batches
PUT /api/admin/internship/batches/:id
GET /api/admin/internship/batches/:id/dependencies
DELETE /api/admin/internship/batches/:id
```

**Create Batch Body:**

```json
{
  "name": "Batch 2024-Q2",
  "quota": 20,
  "startDate": "2024-04-01",
  "endDate": "2024-07-01",
  "mentorName": "Mentor Name",
  "description": "Batch description",
  "status": "open"
}
```

#### Applications

```http
GET /api/admin/internship/applications?status=pending&page=1&limit=20
GET /api/admin/internship/applications/:id
POST /api/admin/internship/applications
PUT /api/admin/internship/applications/:id
PATCH /api/admin/internship/applications/:id/status
DELETE /api/admin/internship/applications/:id
```

**Update Status Body:**

```json
{
  "status": "accepted",
  "notes": "Welcome to the team!"
}
```

### Verification (Admin)

#### Stats

```http
GET /api/admin/verification/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "certificates": { "total": 500, "active": 480, "revoked": 20 },
    "verifications": { "total": 1000, "valid": 950, "invalid": 50 }
  }
}
```

#### Certificates

```http
GET /api/admin/verification/certificates?page=1&limit=20
GET /api/admin/verification/certificates/:id
POST /api/admin/verification/certificates
POST /api/admin/verification/certificates/bulk
PUT /api/admin/verification/certificates/:id
PATCH /api/admin/verification/certificates/:id/revoke
POST /api/admin/verification/certificates/:id/regenerate-code
DELETE /api/admin/verification/certificates/:id
```

**Issue Single Certificate Body:**

```json
{
  "recipientName": "John Doe",
  "programType": "internship",
  "programName": "Software Engineering Internship",
  "issueDate": "2024-01-15",
  "expiryDate": "2025-01-15"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "certificateNumber": "CERT-2024-001",
    "verificationCode": "ABC123XYZ",
    "recipientName": "John Doe",
    "status": "active"
  }
}
```

**Bulk Issue Certificates Body:**

```json
{
  "batchId": "uuid",
  "programType": "internship",
  "programName": "Software Engineering Internship",
  "issueDate": "2024-01-15",
  "expiryDate": "2025-01-15",
  "recipientNames": ["John Doe", "Jane Smith", "Bob Johnson"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "issued": 3,
    "certificates": [
      { "certificateNumber": "CERT-2024-001", "recipientName": "John Doe" },
      { "certificateNumber": "CERT-2024-002", "recipientName": "Jane Smith" },
      { "certificateNumber": "CERT-2024-003", "recipientName": "Bob Johnson" }
    ]
  }
}
```

**Revoke Certificate Body:**

```json
{
  "reason": "Certificate issued in error"
}
```

**Regenerate Verification Code Response:**

```json
{
  "success": true,
  "data": {
    "verificationCode": "NEW789XYZ"
  }
}
```

#### Verification Logs

```http
GET /api/admin/verification/logs?page=1&limit=20
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "certificateId": "uuid",
        "certificateNumber": "CERT-2024-001",
        "verificationCode": "ABC123XYZ",
        "result": "valid",
        "ipAddress": "192.168.1.1",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Manual Verification Check

```http
POST /api/admin/verification/check
Authorization: Bearer <access-token>
```

**Body:**

```json
{
  "verificationCode": "ABC123XYZ"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "certificate": {
      "certificateNumber": "CERT-2024-001",
      "recipientName": "John Doe",
      "programType": "internship",
      "status": "active",
      "issuedAt": "2024-01-15T00:00:00.000Z"
    }
  }
}
```

### Analytics (Admin)

#### Overview

```http
GET /api/admin/analytics/overview?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "pageViews": 15000,
    "sessions": 10000,
    "uniqueVisitors": 8000,
    "bounceRate": 0.45,
    "avgSessionDuration": 180,
    "trafficSources": {
      "direct": 4000,
      "organic": 5000,
      "social": 3000,
      "referral": 2000,
      "email": 1000
    }
  }
}
```

#### Traffic

```http
GET /api/admin/analytics/traffic?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "pageViews": 500,
      "sessions": 350,
      "uniqueVisitors": 300
    }
  ]
}
```

#### Top Pages

```http
GET /api/admin/analytics/top-pages?limit=10
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "path": "/",
      "title": "Home",
      "views": 5000,
      "uniqueViews": 3500
    }
  ]
}
```

#### Devices

```http
GET /api/admin/analytics/devices
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "desktop": 6000,
    "mobile": 3500,
    "tablet": 500,
    "byOS": {
      "Windows": 4000,
      "iOS": 2500,
      "Android": 2000,
      "macOS": 1000,
      "Linux": 500
    }
  }
}
```

#### Content Performance

```http
GET /api/admin/analytics/content-performance
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "topArticles": [...],
    "byCategory": [...],
    "byAuthor": [...]
  }
}
```

#### Funnel

```http
GET /api/admin/analytics/funnel
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "visit": 10000,
    "registration": 2000,
    "consultation": 500,
    "order": 100,
    "paid": 80,
    "conversionRates": {
      "visitToRegistration": 0.20,
      "registrationToConsultation": 0.25,
      "consultationToOrder": 0.20,
      "orderToPaid": 0.80
    }
  }
}
```

#### Ecosystem

```http
GET /api/admin/analytics/ecosystem
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "vertical": "Tanya Mahreen",
      "revenue": 25000000,
      "users": 100,
      "transactions": 50
    }
  ]
}
```

#### Raw Events

```http
GET /api/admin/analytics/events?page=1&limit=100
Authorization: Bearer <access-token>
```

### Reports (Admin)

#### Get Logs

```http
GET /api/admin/reports/logs?type=audit&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=100
Authorization: Bearer <access-token>
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| type | string | Filter by type (audit, activity, analytics) |
| startDate | string | Start date (ISO format) |
| endDate | string | End date (ISO format) |
| page | number | Page number |
| limit | number | Items per page |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "audit",
        "action": "create",
        "resource": "articles",
        "adminId": "uuid",
        "adminName": "Admin Name",
        "summary": "Created article: Article Title",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Export Logs

```http
GET /api/admin/reports/export?type=audit&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access-token>
```

**Response:** CSV file download

### Clients (Admin)

#### List Clients

```http
GET /api/admin/clients?page=1&limit=20
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "fullName": "Client Name",
        "email": "client@example.com",
        "totalOrders": 5,
        "totalSpent": 2500000,
        "lastActivity": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Client Stats

```http
GET /api/admin/clients/:id/stats
Authorization: Bearer <access-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalOrders": 5,
    "totalSpent": 2500000,
    "totalConsultations": 3,
    "totalCertificates": 2,
    "memberSince": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Client Activity

```http
GET /api/admin/clients/:id/activity?limit=20
Authorization: Bearer <access-token>
```

#### Get Client Orders

```http
GET /api/admin/clients/:id/orders
Authorization: Bearer <access-token>
```

#### Get Client Certificates

```http
GET /api/admin/clients/:id/certificates
Authorization: Bearer <access-token>
```

#### Get Client Consultations

```http
GET /api/admin/clients/:id/consultations
Authorization: Bearer <access-token>
```

---

## Error Codes

| Status Code | Description |
|---|---|
| 400 | Bad Request - Invalid input or missing required fields |
| 401 | Unauthorized - Invalid or expired token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Unexpected server error |

---

## Database Schema Reference

### Core Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| users | id (UUID) | email (unique), password, fullName, role, status, permissions (JSON), accountType |
| roles | id (UUID) | name, slug (unique), isSystem |
| role_permissions | id (UUID) | roleId, permission |
| token_blacklist | id (UUID) | tokenHash (SHA-256), tokenType, expiresAt |
| trusted_devices | id (UUID) | userId, deviceFingerprint, tokenHash, is_active, expiresAt |

### Content Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| articles | id (UUID) | slug (unique), title, content, category, status, views, featuredImage |
| topics | id (UUID) | title, articleCount, webinarCount, categories (JSON) |
| webinars | id (UUID) | slug, title, price, isFree, scheduleDate, topics (JSON), mentors (JSON) |
| events | id (UUID) | title, eventDate, location, accessType, isFeatured |
| speakers | id (UUID) | name, role, company, image |
| categories | id (UUID) | name, slug (unique), displayOrder |

### E-Commerce Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| products | id (UUID) | slug, title, price, stock, sku, gallery (JSON), soldCount |
| collection_cards | id (UUID) | title, layout, category, sortOrder |
| specializations | id (UUID) | title, icon, sortOrder |
| service_packages | id (UUID) | serviceKey, tier, name, price, features (JSON) |
| service_addons | id (UUID) | serviceKey, name, price |
| service_comparisons | id (UUID) | serviceKey, feature, better, good, bestValue |

### Transaction Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| transactions | id (UUID) | invoiceId (unique), clientName, amount, status, paymentMethod |
| service_orders | id (UUID) | userId, serviceKey, tier, totalPrice, addons (JSON) |
| consultations | id (UUID) | userId, fullName, serviceInterest, status, consultationType |

### Donation Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| donation_campaigns | id (UUID) | slug, title, targetAmount, collectedAmount, disbursedAmount, status |
| donations | id (UUID) | donorName, amount, campaignId, paymentStatus, isAnonymous |

### CSR Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| csr_programs | id (UUID) | title, category, budget, targetBeneficiaries, currentBeneficiaries, status |
| csr_pillars | id (UUID) | title, icon, sortOrder |
| csr_applications | id (UUID) | userId, programId, role, fullName, status |

### Internship Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| internship_batches | id (UUID) | name, status, quota, startDate, endDate, mentorName |
| internship_applications | id (UUID) | userId, fullName, email, university, specialization, batchId, status |

### Certificate Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| certificates | id (UUID) | certificateNumber (unique), verificationCode (unique), recipientName, programType, status |
| certificate_verifications | id (UUID) | certificateId, verificationCode, result, ipAddress |

### Analytics Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| analytics_events | id (UUID) | eventName, path, sessionId, device, country, metadata (JSON) |
| admin_auditLogs | id (UUID) | adminId, action, resource, resourceId, summary |
| system_activities | id (UUID) | type, title, description, metadata (JSON) |

### User Tables

| Table | Primary Key | Key Fields |
|---|---|---|
| newsletter_subscribers | id (UUID) | email (unique), source, status |
| newsroom_settings | id (UUID) | settingKey (unique), settingValue |
| faqs | id (UUID) | question, answer, category, sortOrder |
| notifications | id (UUID) | userId, type, title, message, isRead |

---

## Additional Notes

### File Uploads

- **Max file size:** 5MB
- **Allowed types:** Images (JPEG, PNG, GIF, WebP) and PDFs
- **Storage location:** `/uploads/` directory
- **URL format:** `https://domain.com/uploads/filename.jpg`

### CORS Configuration

- **Allowed origins:** Configurable via environment variable
- **Credentials:** Enabled
- **Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS

### Security Features

- Helmet HTTP headers
- Rate limiting on sensitive endpoints
- JWT token rotation on refresh
- SHA-256 hashed token blacklisting
- Trusted device management (max 5 per user)
- Password strength validation
- HTML sanitization for content fields
- SQL injection prevention via parameterized queries

### Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|---|---|---|---|
| page | number | 1 | Page number (1-indexed) |
| limit | number | 20 | Items per page (max: 100) |

### Filtering

Most list endpoints support filtering via query parameters. Check individual endpoint documentation for available filters.

### Search

Endpoints with search support use the `search` query parameter for full-text search across relevant fields.
