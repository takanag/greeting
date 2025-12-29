-- Years テーブル: 年度単位のページ情報
CREATE TABLE IF NOT EXISTS years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER UNIQUE NOT NULL,
  title_text TEXT NOT NULL DEFAULT '明けましておめでとうございます',
  greeting_text TEXT NOT NULL DEFAULT '',
  footer_text TEXT NOT NULL DEFAULT '',
  footer_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards テーブル: 年度に紐づくカード情報
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id UUID NOT NULL REFERENCES years(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  by_text TEXT NOT NULL DEFAULT '',
  month TEXT NOT NULL CHECK (month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')),
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_cards_year_id ON cards(year_id);
CREATE INDEX IF NOT EXISTS idx_cards_display_order ON cards(year_id, display_order);

-- RLS (Row Level Security) の有効化
ALTER TABLE years ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- 読み取りは公開（anon 含め誰でも）
CREATE POLICY "Years are viewable by everyone"
  ON years FOR SELECT
  USING (true);

CREATE POLICY "Cards are viewable by everyone"
  ON cards FOR SELECT
  USING (true);

-- 書き込みは認証済みユーザーのみ
-- 注意: 実際の運用では、管理者ロールをチェックする関数を作成し、
-- その関数を使用してポリシーを設定することを推奨
-- ここでは簡易的に authenticated ユーザーのみ許可
CREATE POLICY "Years are editable by authenticated users"
  ON years FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Cards are editable by authenticated users"
  ON cards FOR ALL
  USING (auth.role() = 'authenticated');

-- updated_at を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_years_updated_at BEFORE UPDATE ON years
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

