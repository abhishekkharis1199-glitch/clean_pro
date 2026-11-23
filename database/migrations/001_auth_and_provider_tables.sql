CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE account_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE provider_review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE verification_channel AS ENUM ('email', 'phone');
CREATE TYPE verification_purpose AS ENUM ('account_verification', 'password_reset');
CREATE TYPE provider_document_type AS ENUM ('identity', 'business_registration');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL CHECK (length(trim(first_name)) > 0),
    last_name TEXT NOT NULL CHECK (length(trim(last_name)) > 0),
    email CITEXT NOT NULL UNIQUE,
    phone_e164 TEXT UNIQUE CHECK (
        phone_e164 IS NULL OR phone_e164 ~ '^\+[1-9][0-9]{7,14}$'
    ),
    password_hash TEXT NOT NULL,
    role account_role NOT NULL DEFAULT 'customer',
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL CHECK (length(trim(business_name)) > 0),
    service_category TEXT NOT NULL CHECK (length(trim(service_category)) > 0),
    custom_service_category TEXT,
    team_size SMALLINT CHECK (team_size IS NULL OR team_size BETWEEN 1 AND 500),
    review_status provider_review_status NOT NULL DEFAULT 'pending',
    profile_photo_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        service_category <> 'other'
        OR NULLIF(trim(custom_service_category), '') IS NOT NULL
    )
);

CREATE INDEX provider_profiles_category_status_idx
    ON provider_profiles (service_category, review_status);

CREATE TABLE provider_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_profile_id UUID NOT NULL
        REFERENCES provider_profiles(id) ON DELETE CASCADE,
    document_type provider_document_type NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    content_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL
        CHECK (file_size_bytes BETWEEN 1 AND 10485760),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE verification_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel verification_channel NOT NULL,
    purpose verification_purpose NOT NULL,
    destination TEXT NOT NULL,
    code_mac BYTEA NOT NULL CHECK (octet_length(code_mac) = 32),
    attempt_count SMALLINT NOT NULL DEFAULT 0
        CHECK (attempt_count BETWEEN 0 AND 5),
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (expires_at > created_at)
);

CREATE INDEX verification_challenges_destination_idx
    ON verification_challenges (destination, purpose, created_at DESC);

CREATE TABLE refresh_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE
        CHECK (token_hash ~ '^[0-9a-f]{64}$'),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX refresh_sessions_user_active_idx
    ON refresh_sessions (user_id, expires_at)
    WHERE revoked_at IS NULL;
