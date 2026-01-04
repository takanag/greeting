# Supabase認証メールの日本語化手順

## 概要
Supabaseの認証メール（メール確認、パスワードリセットなど）の文面を日本語に変更する方法です。

## 手順

### 1. Supabase Dashboardにアクセス

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクト `bilejdihnavpjtxgunro` を開く
3. **Authentication** → **Email Templates** に移動

### 2. メールテンプレートの編集

以下のテンプレートを日本語に変更できます：

#### 2.1. メール確認（Confirm signup）

**Subject（件名）:**
```
メールアドレスの確認
```

**Body（本文）:**
```
こんにちは、

以下のメールアドレスでアカウント登録が行われました：
{{ .Email }}

メールアドレスを確認するには、以下のリンクをクリックしてください：
{{ .ConfirmationURL }}

このリンクは24時間有効です。

もしこのメールに心当たりがない場合は、このメールを無視してください。

よろしくお願いいたします。
```

#### 2.2. パスワードリセット（Reset password）

**Subject（件名）:**
```
パスワードリセットのご案内
```

**Body（本文）:**
```
こんにちは、

パスワードリセットのリクエストを受け付けました。

以下のリンクをクリックして、新しいパスワードを設定してください：
{{ .ConfirmationURL }}

このリンクは24時間有効です。

もしこのメールに心当たりがない場合は、このメールを無視してください。

よろしくお願いいたします。
```

#### 2.3. メール変更（Change Email Address）

**Subject（件名）:**
```
メールアドレス変更の確認
```

**Body（本文）:**
```
こんにちは、

メールアドレスの変更リクエストを受け付けました。

新しいメールアドレス: {{ .NewEmail }}

メールアドレスを変更するには、以下のリンクをクリックしてください：
{{ .ConfirmationURL }}

このリンクは24時間有効です。

もしこのメールに心当たりがない場合は、このメールを無視してください。

よろしくお願いいたします。
```

#### 2.4. マジックリンク（Magic Link）

**Subject（件名）:**
```
ログインリンクのご案内
```

**Body（本文）:**
```
こんにちは、

ログインリクエストを受け付けました。

以下のリンクをクリックしてログインしてください：
{{ .ConfirmationURL }}

このリンクは24時間有効です。

もしこのメールに心当たりがない場合は、このメールを無視してください。

よろしくお願いいたします。
```

### 3. 利用可能な変数

Supabaseのメールテンプレートでは以下の変数が使用できます：

- `{{ .Email }}` - ユーザーのメールアドレス
- `{{ .ConfirmationURL }}` - 確認用URL（クリック可能なリンク）
- `{{ .Token }}` - 確認トークン（URLに含まれる）
- `{{ .TokenHash }}` - トークンのハッシュ値
- `{{ .SiteURL }}` - サイトのURL
- `{{ .RedirectTo }}` - リダイレクト先URL
- `{{ .NewEmail }}` - 新しいメールアドレス（メール変更時のみ）

### 4. HTMLメールの使用

HTMLメールを使用する場合は、**Use HTML** オプションを有効にし、HTML形式で記述できます。

**例（HTML形式）:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;">
  <h2>メールアドレスの確認</h2>
  <p>こんにちは、</p>
  <p>以下のメールアドレスでアカウント登録が行われました：<br>
  <strong>{{ .Email }}</strong></p>
  <p>メールアドレスを確認するには、以下のボタンをクリックしてください：</p>
  <p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">メールアドレスを確認</a></p>
  <p style="font-size: 12px; color: #666;">このリンクは24時間有効です。</p>
  <p>もしこのメールに心当たりがない場合は、このメールを無視してください。</p>
  <p>よろしくお願いいたします。</p>
</body>
</html>
```

### 5. カスタムSMTPの使用

カスタムSMTPサーバーを使用している場合：

1. **Authentication** → **Settings** → **SMTP Settings** に移動
2. カスタムSMTPサーバーの設定を確認
3. メールテンプレートは上記の手順で編集可能

### 6. プレビューとテスト

1. テンプレートを保存後、**Preview** ボタンでプレビューを確認
2. 実際のメールアドレスでテスト登録を行い、メールが正しく送信されるか確認

### 7. 注意事項

- テンプレートを変更した後、既存のユーザーには影響しません
- 新規登録やパスワードリセット時に新しいテンプレートが使用されます
- `{{ .ConfirmationURL }}` は必ず含める必要があります（メール確認のため）
- HTMLメールを使用する場合、プレーンテキスト版も用意することを推奨

## 参考リンク

- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase SMTP Settings](https://supabase.com/docs/guides/auth/auth-smtp)


