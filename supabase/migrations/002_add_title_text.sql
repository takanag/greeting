-- title_text カラムを追加（既存のテーブルに適用する場合）
ALTER TABLE years 
ADD COLUMN IF NOT EXISTS title_text TEXT NOT NULL DEFAULT '明けましておめでとうございます';

-- 既存のデータがある場合、デフォルト値を設定
UPDATE years 
SET title_text = '明けましておめでとうございます' 
WHERE title_text IS NULL OR title_text = '';

