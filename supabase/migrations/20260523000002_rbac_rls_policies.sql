-- 1. Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_data_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies using DO blocks to avoid duplicate errors
DO $$
BEGIN
  -- users SELECT: Users can view other users of the same tenant
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Tenant isolation for users select'
  ) THEN
    CREATE POLICY "Tenant isolation for users select"
    ON users
    FOR SELECT TO authenticated
    USING (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    );
  END IF;

  -- users UPDATE: Admins can update any user of the same tenant, users can update themselves
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admin or self update for users'
  ) THEN
    CREATE POLICY "Admin or self update for users"
    ON users
    FOR UPDATE TO authenticated
    USING (
      (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND (auth.jwt() ->> 'role') = 'admin')
      OR id = auth.uid()
    );
  END IF;

  -- audit_sessions ALL: Tenant isolation
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audit_sessions' AND policyname = 'Tenant isolation for audit_sessions'
  ) THEN
    CREATE POLICY "Tenant isolation for audit_sessions"
    ON audit_sessions
    FOR ALL TO authenticated
    USING (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    );
  END IF;

  -- audit_data_entries ALL: Tenant isolation through parent session
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audit_data_entries' AND policyname = 'Tenant isolation for audit_data_entries'
  ) THEN
    CREATE POLICY "Tenant isolation for audit_data_entries"
    ON audit_data_entries
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM audit_sessions s
        WHERE s.id = session_id
        AND s.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
      )
    );
  END IF;

  -- bulk_import_batches SELECT: Tenant isolation
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bulk_import_batches' AND policyname = 'Tenant isolation for bulk_import_batches select'
  ) THEN
    CREATE POLICY "Tenant isolation for bulk_import_batches select"
    ON bulk_import_batches
    FOR SELECT TO authenticated
    USING (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    );
  END IF;

  -- bulk_import_batches INSERT: Admin only
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bulk_import_batches' AND policyname = 'Admin only insert for bulk_import_batches'
  ) THEN
    CREATE POLICY "Admin only insert for bulk_import_batches"
    ON bulk_import_batches
    FOR INSERT TO authenticated
    WITH CHECK (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
      AND (auth.jwt() ->> 'role') = 'admin'
    );
  END IF;

  -- consent_records ALL: User own records, or Admins of the same tenant
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'consent_records' AND policyname = 'Consent records isolation'
  ) THEN
    CREATE POLICY "Consent records isolation"
    ON consent_records
    FOR ALL TO authenticated
    USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = user_id
        AND u.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        AND (auth.jwt() ->> 'role') = 'admin'
      )
    );
  END IF;
END
$$;

-- 3. Role Change Audit Trigger Function and Trigger
CREATE OR REPLACE FUNCTION fn_log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role_id IS DISTINCT FROM NEW.role_id THEN
    INSERT INTO audit_log (
      id,
      tenant_id,
      table_name,
      record_id,
      action,
      old_data,
      new_data,
      changed_by,
      created_at
    ) VALUES (
      gen_random_uuid(),
      NEW.tenant_id,
      'users',
      NEW.id,
      'ROLE_CHANGED',
      jsonb_build_object('role_id', OLD.role_id),
      jsonb_build_object('role_id', NEW.role_id),
      auth.uid(),
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if not exists
DROP TRIGGER IF EXISTS trg_role_change_audit ON users;
CREATE TRIGGER trg_role_change_audit
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION fn_log_role_change();
