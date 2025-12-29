-- years テーブルに username カラムを追加
-- メールアドレスの@の前の部分を保存（例: takanag@gmail.com → takanag）
ALTER TABLE years 
ADD COLUMN IF NOT EXISTS username TEXT;

-- 既存のデータがある場合、user_idからメールアドレスを取得してusernameを設定
-- 注意: この処理は管理者が手動で実行する必要があります
-- Supabase DashboardのSQL Editorで以下を実行してください：
-- 
-- UPDATE years 
-- SET username = (
--   SELECT split_part(email, '@', 1) 
--   FROM auth.users 
--   WHERE auth.users.id = years.user_id
-- )
-- WHERE username IS NULL;

-- usernameとyearの組み合わせでインデックスを作成（検索を高速化）
CREATE INDEX IF NOT EXISTS idx_years_username_year ON years(username, year);

-- usernameとyearの組み合わせでUNIQUE制約を追加（同じusernameは同じ年度のページを1つだけ作成可能）
-- これにより、/greeting/{username}/{year}/ のURLが一意になる
CREATE UNIQUE INDEX IF NOT EXISTS idx_years_username_year_unique ON years(username, year);

