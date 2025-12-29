-- years テーブルに user_id カラムを追加
ALTER TABLE years 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- year の UNIQUE 制約を削除（複数のユーザーが同じ年度のページを作成できるように）
ALTER TABLE years 
DROP CONSTRAINT IF EXISTS years_year_key;

-- user_id と year の組み合わせで UNIQUE 制約を追加（同じユーザーは同じ年度のページを1つだけ作成可能）
CREATE UNIQUE INDEX IF NOT EXISTS idx_years_user_year_unique ON years(user_id, year);

-- 既存のデータがある場合、デフォルトで最初の認証済みユーザーに割り当て
-- 注意: 本番環境では適切なユーザーIDを設定してください
-- 例: UPDATE years SET user_id = (SELECT id FROM auth.users WHERE email = 'takanag@gmail.com' LIMIT 1) WHERE user_id IS NULL;

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_years_user_id ON years(user_id);

-- 管理者を判定する関数を作成
-- 管理者のメールアドレスを環境変数または設定で管理することを推奨
-- ここでは簡易的に特定のメールアドレスを管理者として設定
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- 管理者のメールアドレスリスト（必要に応じて変更）
  -- 本番環境では、別のテーブルや設定で管理することを推奨
  RETURN user_email IN (
    'takanag@gmail.com'  -- 管理者のメールアドレス
    -- 必要に応じて追加の管理者メールアドレスを追加
    -- 例: 'admin@example.com', 'another-admin@example.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 現在のユーザーが管理者かどうかを判定する関数
CREATE OR REPLACE FUNCTION current_user_is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- 現在のユーザーのメールアドレスを取得
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- 管理者かどうかを判定
  RETURN is_admin(user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Years are editable by authenticated users" ON years;
DROP POLICY IF EXISTS "Cards are editable by authenticated users" ON cards;

-- 新しいRLSポリシー: ユーザーは自分のページのみ編集可能、管理者はすべて編集可能
CREATE POLICY "Years are editable by owner or admin"
  ON years FOR ALL
  USING (
    -- 所有者であるか、または管理者である
    (user_id = auth.uid()) OR current_user_is_admin()
  )
  WITH CHECK (
    -- INSERT時は現在のユーザーをuser_idに設定
    (user_id = auth.uid()) OR current_user_is_admin()
  );

CREATE POLICY "Cards are editable by year owner or admin"
  ON cards FOR ALL
  USING (
    -- カードが属する年度の所有者であるか、または管理者である
    EXISTS (
      SELECT 1 FROM years 
      WHERE years.id = cards.year_id 
      AND ((years.user_id = auth.uid()) OR current_user_is_admin())
    )
  )
  WITH CHECK (
    -- INSERT時も同様にチェック
    EXISTS (
      SELECT 1 FROM years 
      WHERE years.id = cards.year_id 
      AND ((years.user_id = auth.uid()) OR current_user_is_admin())
    )
  );

