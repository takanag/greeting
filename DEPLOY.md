# デプロイ手順

## 1. GitHubリポジトリの作成

1. GitHubにログインして、新しいリポジトリを作成
   - リポジトリ名: `greetings-2026` (任意)
   - 公開/非公開: お好みで選択
   - README、.gitignore、ライセンスは追加しない（既に存在するため）

## 2. リモートリポジトリの追加とプッシュ

```bash
# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# ブランチ名をmainに変更（推奨）
git branch -M main

# プッシュ
git push -u origin main
```

## 3. Vercelへのデプロイ

### 方法1: Vercel Dashboardから（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. "Add New..." → "Project" をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (デフォルト)
   - **Build Command**: `npm run build` (デフォルト)
   - **Output Directory**: `.next` (デフォルト)
5. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: SupabaseのPublishable Key
   - `SUPABASE_SECRET_KEY`: SupabaseのSecret Key
6. "Deploy" をクリック

### 方法2: Vercel CLIを使用

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

## 4. 環境変数の設定

Vercel Dashboardで以下の環境変数を設定してください：

- `NEXT_PUBLIC_SUPABASE_URL`: https://bilejdihnavpjtxgunro.supabase.co
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase DashboardのSettings > APIから取得
- `SUPABASE_SECRET_KEY`: Supabase DashboardのSettings > APIから取得

## 5. デプロイ後の確認

- 公開ページ: `https://your-project.vercel.app/greeting/2026`
- 管理画面: `https://your-project.vercel.app/greeting/admin`

## 注意事項

- `.env.local`ファイルはGitに含まれません（`.gitignore`で除外）
- 環境変数はVercel Dashboardで設定してください
- Supabaseのマイグレーションは手動で実行する必要があります

