-- Supabase Storage バケットの作成
-- 注意: このSQLは Supabase Dashboard の SQL Editor で実行してください

-- バケットを作成（既に存在する場合はスキップ）
INSERT INTO storage.buckets (id, name, public)
VALUES ('greeting-images', 'greeting-images', true)
ON CONFLICT (id) DO NOTHING;

-- バケットポリシー: 読み取りは公開
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'greeting-images');

-- バケットポリシー: アップロードは認証済みユーザーのみ
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'greeting-images' 
  AND auth.role() = 'authenticated'
);

-- バケットポリシー: 削除は認証済みユーザーのみ
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'greeting-images' 
  AND auth.role() = 'authenticated'
);

