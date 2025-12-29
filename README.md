# New Year Greeting Web Page

年賀状の代替として、毎年1ページずつ公開する「New Year Greeting Web Page」プロジェクト。

## 技術スタック

- Next.js (App Router) + TypeScript
- Supabase (Postgres, Auth, Storage)
- Vercel (ホスティング)
- Tailwind CSS

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase のセットアップ

#### 2.1 データベースマイグレーション

Supabase Dashboard の SQL Editor で以下を実行：

```sql
-- supabase/migrations/001_initial_schema.sql の内容を実行
```

#### 2.2 Storage バケットの作成

Supabase Dashboard の SQL Editor で以下を実行：

```sql
-- supabase/storage-setup.sql の内容を実行
```

または、Supabase Dashboard の Storage セクションから手動で：
- バケット名: `greeting-images`
- 公開バケット: 有効

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://bilejdihnavpjtxgunro.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
```

環境変数は Supabase Dashboard の Settings > API から取得できます。
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Publishable key（旧 ANON key に相当）
- `SUPABASE_SECRET_KEY`: Secret key（旧 Service Role Key に相当）

### 4. 開発サーバーの起動

```bash
npm run dev
```

## URL設計

- 公開ページ: `/greeting/[year]/` (例: `/greeting/2026/`)
- 管理画面: `/greeting/admin`
- ログイン: `/greeting/admin/login`

## 機能

### 公開ページ

- 年度ごとの年賀状ページを表示
- カード形式で写真とテキストを表示
- サムネイルクリックで画像を拡大表示
- レスポンシブ対応

### 管理画面

- Supabase Auth による認証
- 年度の作成・選択
- 挨拶文・住所・連絡先の編集
- カードの CRUD 操作
- ドラッグ&ドロップによる並び替え
- 画像アップロード（自動最適化・サムネイル生成）
- リアルタイムプレビュー

## 画像最適化

アップロード時に自動で以下を実行：

- 自動リサイズ（拡大表示用: 最大幅1200px、サムネイル: 最大幅400px）
- WebP 形式への変換と圧縮
- EXIF回転補正
- オリジナル画像は保存せず、最適化済み画像のみ保存

実装は Vercel API Routes (`app/api/upload-image/route.ts`) で行っています。

## デプロイ

### Vercel へのデプロイ

1. Vercel にプロジェクトを接続
2. 環境変数を設定
3. デプロイ

Team: `vercel.com/takanags-projects`

## 注意事項

- RLS (Row Level Security) により、データの読み取りは公開、書き込みは認証済みユーザーのみ可能
- 画像は Supabase Storage の `greeting-images` バケットに保存されます
- 管理画面へのアクセスには Supabase Auth でのログインが必要です

