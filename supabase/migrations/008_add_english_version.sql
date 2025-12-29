-- 英語版のフィールドを追加
ALTER TABLE years 
ADD COLUMN IF NOT EXISTS english_enabled BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE years 
ADD COLUMN IF NOT EXISTS title_text_en TEXT;

ALTER TABLE years 
ADD COLUMN IF NOT EXISTS greeting_text_en TEXT;

ALTER TABLE years 
ADD COLUMN IF NOT EXISTS footer_text_en TEXT;

-- cardsテーブルにも英語版のフィールドを追加
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS title_en TEXT;

ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS by_text_en TEXT;

