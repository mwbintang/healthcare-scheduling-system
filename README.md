# 🏥 Microservices GraphQL – Auth & Schedule Service

Project ini adalah backend berbasis **NestJS + GraphQL** dengan arsitektur **microservices**, terdiri dari:

- **Auth Service** → login, register, token validation
- **Schedule Service** → doctor, customer, schedule management
- **PostgreSQL** → database terpisah per service
- **Docker & Docker Compose** → containerized environment

---

## 🧩 Tech Stack

- **Node.js**: v22.x
- **npm**: v10.x+
- **NestJS**
- **GraphQL (Apollo)**
- **Prisma ORM**
- **PostgreSQL**
- **Docker & Docker Compose**

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Prerequisites

Pastikan sudah terinstall:
- Docker
- Docker Compose

---

### 2️⃣ Setup Environment Variables

Project ini menggunakan environment variables yang didefinisikan melalui file `.env`.

👉 **Contoh environment variables tersedia di file**: .env.example


Salin dan sesuaikan:

```bash
cp .env.example .env
```
Contoh isi .env:

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=auth_service_db
SCHEDULE_DB=schedule_service_db

# Internal service URLs (Docker network)
AUTHENTICATION_SERVICE=http://auth-service:3001
SCHEDULE_SERVICE=http://schedule-service:3002
PORT=
API_KEY=
JWT_SECRET=
---

### 3️⃣ Build & Run dengan Docker Compose

Jalankan perintah berikut dari root project:

```bash
docker compose build --no-cache
docker compose up
```

Jika berhasil, service akan berjalan di:

| Service          | URL                                                            |
| ---------------- | -------------------------------------------------------------- |
| Auth Service     | [http://localhost:3001/graphql](http://localhost:3001/graphql) |
| Schedule Service | [http://localhost:3002/graphql](http://localhost:3002/graphql) |
| PostgreSQL       | localhost:5439                                                 |

---

### 4️⃣ Stop Containers

```bash
docker compose down
```

---

🏗️ Arsitektur Sistem

+------------------+        GraphQL        +---------------------+
|                  |  ------------------> |                     |
|  Client (Web /   |                      |   Auth Service      |
|  Mobile / Postman)| <------------------ |   (NestJS + GQL)    |
|                  |        JWT           |                     |
+------------------+                      +----------+----------+
                                                      |
                                                      | HTTP (token validation)
                                                      v
                                           +----------+----------+
                                           |                     |
                                           |  Schedule Service   |
                                           |  (NestJS + GQL)     |
                                           |                     |
                                           +----------+----------+
                                                      |
                                                      |
                                +---------------------+---------------------+
                                |                                           |
                        +-------+-------+                           +-------+-------+
                        | PostgreSQL    |                           | PostgreSQL    |
                        | Auth DB       |                           | Schedule DB   |
                        +---------------+                           +---------------+


---

📬 GraphQL Documentation

Dokumentasi GraphQL tersedia dalam bentuk Postman Collection

File Postman berformat .json

Silakan import file tersebut ke aplikasi Postman untuk mencoba seluruh Queries & Mutations

---

✅ Notes

Prisma migrations dijalankan otomatis saat container start

Service-to-service communication menggunakan Docker internal DNS

Auth guard melakukan token validation ke Auth Service

---

👨‍💻 Author

Bintang Muhammad Wahid
Backend Engineer – NestJS / GraphQL / Microservices