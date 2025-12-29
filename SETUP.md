# セットアップガイド

## 初回セットアップ手順

### 1. プロジェクトのクローンと依存関係のインストール

```bash
npm install
```

### 2. Supabase の設定

#### 2.1 データベーステーブルの作成

Supabase Dashboard (https://bilejdihnavpjtxgunro.supabase.co) にログインし、
SQL Editor を開いて `supabase/migrations/001_initial_schema.sql` の内容を実行してください。

これにより、以下のテーブルが作成されます：

- `years`: 年度単位のページ情報
- `cards`: カード情報

#### 2.2 Storage バケットの作成

SQL Editor で `supabase/storage-setup.sql` の内容を実行するか、
Storage セクションから手動で以下を作成：

- バケット名: `greeting-images`
- 公開バケット: 有効

#### 2.3 認証ユーザーの作成

Supabase Dashboard の Authentication セクションから、管理用のユーザーを作成してください。

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://bilejdihnavpjtxgunro.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_SECRET_KEY=your_secret_key_here
```

これらの値は Supabase Dashboard の Settings > API から取得できます。

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Publishable key（旧 ANON key に相当）
- `SUPABASE_SECRET_KEY`: Secret key（旧 Service Role Key に相当）

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて確認してください。

## 初回データの投入

管理画面 (`/greeting/admin`) にログインし、以下を実行：

1. 「新規年度を作成」ボタンから年度を作成（例: 2026）
2. 挨拶文と住所・連絡先を入力
3. カードを追加して画像とテキストを入力

## トラブルシューティング

### 画像がアップロードできない

- Supabase Storage のバケットが正しく作成されているか確認
- Storage のポリシーが正しく設定されているか確認
- 環境変数 `SUPABASE_SERVICE_ROLE_KEY` が正しく設定されているか確認

### 認証エラー

- Supabase Dashboard でユーザーが正しく作成されているか確認
- RLS ポリシーが正しく設定されているか確認

### データが表示されない

- データベースにデータが正しく投入されているか確認
- ブラウザのコンソールでエラーを確認
