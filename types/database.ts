export type ContactInfo = {
  home: {
    address?: string;
    phone?: string;
  };
  // 後方互換性のため、既存のtakahikoとitsukiも保持
  takahiko?: {
    name?: string;
    email: string;
    phone: string;
  };
  itsuki?: {
    name?: string;
    email: string;
    phone: string;
  };
  // 新しい構造: 連絡先の配列
  contacts?: Array<{
    name?: string;
    email: string;
    phone: string;
  }>;
  // 表示する連絡先の数（デフォルト: 2）
  contact_count?: number;
};

export type Year = {
  id: string;
  year: number;
  title_text: string;
  greeting_text: string;
  header_background_url: string | null;
  footer_text: string;
  footer_visible: boolean;
  contact_info: ContactInfo | null;
  user_id: string | null;
  username: string | null; // メールアドレスの@の前の部分
  created_at: string;
  updated_at: string;
};

export type Card = {
  id: string;
  year_id: string;
  title: string;
  by_text: string;
  month: 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
  description: string;
  image_url: string;
  thumbnail_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type YearWithCards = Year & {
  cards: Card[];
};

