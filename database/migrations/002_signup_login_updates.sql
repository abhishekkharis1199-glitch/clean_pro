ALTER TABLE cleanpro.users
    ADD COLUMN IF NOT EXISTS date_of_birth DATE;

ALTER TABLE cleanpro.users
    ALTER COLUMN phone_e164 DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_date_of_birth_check'
          AND conrelid = 'cleanpro.users'::regclass
    ) THEN
        ALTER TABLE cleanpro.users
            ADD CONSTRAINT users_date_of_birth_check
            CHECK (
                date_of_birth IS NULL
                OR (
                    date_of_birth <= (CURRENT_DATE - INTERVAL '13 years')::date
                    AND date_of_birth >= '1900-01-01'::date
                )
            );
    END IF;
END $$;
