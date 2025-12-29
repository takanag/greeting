-- ヘッダー背景画像を追加
ALTER TABLE years 
ADD COLUMN IF NOT EXISTS header_background_url TEXT;

-- 連絡先情報を構造化（JSON形式で保存）
-- 自宅、恭彦連絡先、樹連絡先を分けて管理
ALTER TABLE years 
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{"home": {"address": "", "phone": ""}, "takahiko": {"email": "", "phone": ""}, "itsuki": {"email": "", "phone": ""}}'::jsonb;

