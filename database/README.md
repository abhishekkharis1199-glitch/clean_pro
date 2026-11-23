# Database

CleanPro uses PostgreSQL. The initial authentication and provider schema is in
[`migrations/001_auth_and_provider_tables.sql`](./migrations/001_auth_and_provider_tables.sql).

Create the `cleanpro` database and apply this migration once using a database
administrator account. If another PostgreSQL version already uses port 5432,
configure this instance on port 5433 and use that port in these commands:

```powershell
createdb -h localhost -p 5433 -U postgres cleanpro
psql -h localhost -p 5433 -U postgres -d cleanpro -v ON_ERROR_STOP=1 -1 -f database/migrations/001_auth_and_provider_tables.sql
```

The migration creates account, provider profile, private document metadata,
verification challenge, and refresh-session tables. Provider document contents
belong in private file storage; only their storage keys and metadata are kept
in PostgreSQL.

Security notes:

- Store only a password hash produced by a password-hashing algorithm such as
  Argon2id or bcrypt. Never store a user's password.
- Store a server-keyed HMAC of a verification code in `code_mac`, not the
  short code itself.
- Store a cryptographic hash of each refresh token in `token_hash`.
- Never accept the `admin` role from public signup requests.
- Restrict database credentials to the local backend and keep them out of
  source control.
