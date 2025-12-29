# 404 エラーのトラブルシューティング

## 問題

`https://benri.website/greeting/2026` で 404 エラーが発生する

## 考えられる原因と対処法

### 1. データベースに 2026 年のデータが存在しない

**確認方法：**

1. Supabase Dashboard にログイン
2. Table Editor → `years` テーブルを開く
3. `year = 2026` のレコードが存在するか確認

**対処法：**

- 管理画面（`/greeting/admin`）にログイン
- 「新規年度を作成」から 2026 年を作成
- 必要に応じて挨拶文やカードを追加

### 2. RLS ポリシーの問題

**確認方法：**

1. Supabase Dashboard → Authentication → Policies
2. `years` テーブルの SELECT ポリシーを確認
3. `"Years are viewable by everyone"` ポリシーが存在し、`USING (true)` になっているか確認

**対処法：**
以下の SQL を Supabase SQL Editor で実行：

```sql
-- SELECTポリシーを確認
SELECT * FROM pg_policies WHERE tablename = 'years';

-- 必要に応じてポリシーを再作成
DROP POLICY IF EXISTS "Years are viewable by everyone" ON years;
CREATE POLICY "Years are viewable by everyone"
  ON years FOR SELECT
  USING (true);
```

### 3. 環境変数が正しく設定されていない

**確認方法：**

1. Vercel Dashboard → Project Settings → Environment Variables
2. 以下の環境変数が設定されているか確認：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**対処法：**

- 環境変数を正しく設定
- デプロイを再実行

### 4. ビルド/デプロイの問題

**確認方法：**

1. Vercel Dashboard → Deployments
2. 最新のデプロイメントのログを確認
3. ビルドエラーがないか確認

**対処法：**

- エラーがある場合は修正
- 再デプロイを実行

### 5. キャッシュの問題

**対処法：**

1. Vercel Dashboard → Settings → Functions
2. 「Clear Cache」を実行
3. ブラウザのキャッシュをクリア

### 6. 複数ユーザーが同じ年度のページを作成している場合

**確認方法：**

1. Supabase Dashboard → Table Editor → `years`
2. `year = 2026` のレコードが複数存在するか確認
3. 各レコードの `user_id` を確認

**対処法：**

- 公開ページでは、最初に見つかったレコードが表示されます
- 特定のユーザーのページを表示したい場合は、`user_id` でフィルタリングする必要があります
- または、不要なレコードを削除

## デバッグ方法

### サーバーログの確認

Vercel Dashboard → Functions → Logs でエラーログを確認できます。

### ローカル環境での確認

```bash
# 開発サーバーを起動
npm run dev

# http://localhost:3000/greeting/2026 にアクセス
# ブラウザのコンソールとターミナルのログを確認
```

### Supabase クエリの直接確認

Supabase Dashboard → SQL Editor で以下を実行：

```sql
-- 2026年のデータを確認
SELECT * FROM years WHERE year = 2026;

-- 2026年のカードを確認
SELECT c.* FROM cards c
JOIN years y ON c.year_id = y.id
WHERE y.year = 2026
ORDER BY c.display_order;
```

## よくある問題

### 問題：データは存在するが 404 が返される

**原因：**

- RLS ポリシーが正しく設定されていない
- 環境変数が間違っている

**対処法：**

- RLS ポリシーを確認・修正
- 環境変数を再確認

### 問題：ローカルでは動作するが本番環境で 404

**原因：**

- 本番環境の環境変数が設定されていない
- 本番環境のデータベースにデータが存在しない

**対処法：**

- Vercel Dashboard で環境変数を確認
- 本番環境の Supabase データベースにデータが存在するか確認
