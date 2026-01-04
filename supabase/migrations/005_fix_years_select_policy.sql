-- years テーブルのSELECTポリシーを修正
-- 公開ページでは誰でも閲覧可能、管理画面ではユーザー固有のデータのみ表示

-- 既存のSELECTポリシーを削除
DROP POLICY IF EXISTS "Years are viewable by everyone" ON years;

-- 新しいSELECTポリシー: 認証済みユーザーは自分のページのみ、未認証ユーザーはすべて閲覧可能
-- 公開ページ（未認証）ではすべてのページを閲覧できる必要がある
-- 管理画面（認証済み）では、クライアント側でuser_idでフィルタリングする
CREATE POLICY "Years are viewable by everyone"
  ON years FOR SELECT
  USING (true);

-- 注意: 管理画面でのフィルタリングは、クライアント側（app/greeting/admin/page.tsx）で実装
-- 管理者はすべてのページを、一般ユーザーは自分のページのみを表示


