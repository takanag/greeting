# Supabase認証設定の確認

## 新規ユーザー登録時の400エラーについて

新規ユーザー登録時に400エラーが発生する場合、以下の設定を確認してください。

### 1. Supabase Dashboardでの設定確認

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクト `bilejdihnavpjtxgunro` を開く
3. **Authentication** → **Settings** に移動

### 2. 確認すべき設定項目

#### メール確認の設定
- **Enable email confirmations**: 有効/無効を確認
  - 有効の場合：メール確認が必要（デフォルト）
  - 無効の場合：メール確認なしでログイン可能

#### リダイレクトURLの設定
- **Site URL**: `http://localhost:3000` (開発環境) または `https://your-domain.vercel.app` (本番環境)
- **Redirect URLs**: 以下のURLを追加
  - `http://localhost:3000/greeting/admin/login` (開発環境)
  - `https://your-domain.vercel.app/greeting/admin/login` (本番環境)

#### サインアップの有効化
- **Enable Sign Up**: 有効になっているか確認
  - 無効の場合、新規登録ができません

#### メールテンプレートの設定
- **Email Templates** → **Confirm signup** を確認
- メール送信が正常に動作しているか確認

### 3. よくあるエラーと対処法

#### エラー: "User already registered"
- 既に登録されているメールアドレスです
- ログインページからログインしてください

#### エラー: "Invalid email" または "Email format is invalid"
- メールアドレスの形式が正しくありません
- 正しいメールアドレス形式で入力してください

#### エラー: "Password should be at least 6 characters"
- パスワードが6文字未満です
- 6文字以上のパスワードを入力してください

#### エラー: "Signup is disabled"
- 新規登録が無効になっています
- Supabase Dashboard → Authentication → Settings で有効化してください

#### エラー: "Email rate limit exceeded"
- メール送信の制限に達しました
- しばらく待ってから再度お試しください

### 4. 開発環境でのメール確認を無効化する場合

開発中にメール確認をスキップしたい場合：

1. Supabase Dashboard → Authentication → Settings
2. **Enable email confirmations** を無効化
3. これにより、メール確認なしでログイン可能になります

**注意**: 本番環境ではセキュリティのため、メール確認を有効にすることを推奨します。

### 5. メールが届かない場合

1. スパムフォルダを確認
2. Supabase Dashboard → Authentication → Settings → **SMTP Settings** を確認
3. カスタムSMTPサーバーを使用している場合、設定を確認

### 6. デバッグ方法

ブラウザの開発者ツール（F12）のコンソールで、詳細なエラーメッセージを確認できます。

開発環境では、エラーメッセージに元のSupabaseエラーメッセージが含まれます。

