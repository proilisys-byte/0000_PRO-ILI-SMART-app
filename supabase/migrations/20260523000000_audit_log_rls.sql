-- 1. UPDATE 및 DELETE 차단을 위한 트리거 함수 정의
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'COMPLIANCE LOCKUP: Modification or deletion of audit_log records is strictly prohibited.';
END;
$$ LANGUAGE plpgsql;

-- 2. 트리거 부착
CREATE OR REPLACE TRIGGER trg_prevent_audit_log_update_delete
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_modification();

-- 3. Insert-only 강제를 위한 RLS 정책 설정
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성 (중복 에러 방지를 위해 DO 블록 사용)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audit_log' AND policyname = 'Allow insert for authenticated users'
  ) THEN
    CREATE POLICY "Allow insert for authenticated users" 
    ON audit_log 
    FOR INSERT TO authenticated 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audit_log' AND policyname = 'Allow select for users of the same tenant'
  ) THEN
    CREATE POLICY "Allow select for users of the same tenant" 
    ON audit_log 
    FOR SELECT TO authenticated 
    USING (
      tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
    );
  END IF;
END
$$;
