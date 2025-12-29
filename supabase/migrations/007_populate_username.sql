-- 既存のyearsレコードにusernameを設定
-- 注意: このマイグレーションは管理者が手動で実行する必要があります
-- Supabase DashboardのSQL Editorで実行してください

-- 既存のyearsレコードのusernameを設定（user_idからメールアドレスを取得）
UPDATE years 
SET username = (
  SELECT split_part(email, '@', 1) 
  FROM auth.users 
  WHERE auth.users.id = years.user_id
)
WHERE username IS NULL AND user_id IS NOT NULL;

-- 確認: usernameが設定されていないレコードがないか確認
-- SELECT id, year, user_id, username FROM years WHERE username IS NULL;

