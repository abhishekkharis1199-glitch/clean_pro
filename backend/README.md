# CleanPro Backend

Node.js and Express authentication API for CleanPro.

## Setup

1. Copy `.env.example` to `.env`.
2. Update PostgreSQL credentials and JWT secrets.
3. Run `npm install`.
4. Run `npm run dev`.

The API listens on `http://localhost:4000` by default.

## Authentication endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

The frontend defaults to `http://localhost:5173` and the backend allows that origin.
