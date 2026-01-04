# VercelとGitHubの接続手順

## 問題
GitHubからVercelへの自動デプロイが機能していない

## 解決方法

### 方法1: Vercel Dashboardから接続（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクト `2026` を開く
3. **Settings** → **Git** に移動
4. **Connect Git Repository** をクリック
5. GitHubアカウントを認証（まだ認証していない場合）
6. リポジトリ `takanag/greeting` を選択
7. **Connect** をクリック

### 方法2: GitHubアプリのインストール確認

1. [GitHub Settings](https://github.com/settings/installations)にアクセス
2. **Vercel** アプリがインストールされているか確認
3. インストールされていない場合、またはアクセス権限がない場合：
   - Vercel Dashboard → Settings → Git に移動
   - **Install Vercel for GitHub** をクリック
   - リポジトリへのアクセス権限を付与

### 方法3: プロジェクトを削除して再作成

既存のプロジェクトに問題がある場合：

1. Vercel Dashboardでプロジェクト `2026` を削除
2. **Add New...** → **Project** をクリック
3. GitHubリポジトリ `takanag/greeting` をインポート
4. プロジェクト名を `greeting-2026` など別名にする（競合回避）
5. 環境変数を設定
6. **Deploy** をクリック

## 環境変数の設定

接続後、以下の環境変数を設定してください：

- `NEXT_PUBLIC_SUPABASE_URL`: `https://bilejdihnavpjtxgunro.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase Dashboardから取得
- `SUPABASE_SECRET_KEY`: Supabase Dashboardから取得

## 確認

接続後、GitHubにプッシュすると自動的にVercelでデプロイが開始されます。


