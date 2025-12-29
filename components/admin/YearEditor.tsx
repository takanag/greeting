'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { YearWithCards, ContactInfo } from '@/types/database';
import HeaderImageUploader from './HeaderImageUploader';

export default function YearEditor({
  year,
  onUpdate,
}: {
  year: YearWithCards;
  onUpdate: () => void;
}) {
  const [titleText, setTitleText] = useState(year.title_text);
  const [greetingText, setGreetingText] = useState(year.greeting_text);
  const [headerBackgroundUrl, setHeaderBackgroundUrl] = useState(year.header_background_url || '');
  const [footerText, setFooterText] = useState(year.footer_text);
  const [footerVisible, setFooterVisible] = useState(year.footer_visible);
  
  // 連絡先情報
  const defaultContactInfo: ContactInfo = {
    home: { address: '', phone: '' },
    takahiko: { email: '', phone: '' },
    itsuki: { email: '', phone: '' },
  };
  const [contactInfo, setContactInfo] = useState<ContactInfo>(
    year.contact_info || defaultContactInfo
  );
  
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('years')
        .update({
          title_text: titleText,
          greeting_text: greetingText,
          header_background_url: headerBackgroundUrl || null,
          footer_text: footerText,
          footer_visible: footerVisible,
          contact_info: contactInfo,
        })
        .eq('id', year.id);

      if (error) throw error;

      onUpdate();
      alert('保存しました');
    } catch (err: any) {
      alert('保存に失敗しました: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">年度情報の編集</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル（「明けましておめでとうございます」の部分）
          </label>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            新年挨拶文（改行可能）
          </label>
          <textarea
            value={greetingText}
            onChange={(e) => setGreetingText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-900"
            placeholder="新年の挨拶文を入力してください（Enterキーで改行できます）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ヘッダー背景画像
          </label>
          <HeaderImageUploader
            onUpload={(imageUrl) => setHeaderBackgroundUrl(imageUrl)}
            currentImageUrl={headerBackgroundUrl}
          />
          {headerBackgroundUrl && (
            <button
              onClick={() => setHeaderBackgroundUrl('')}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              背景画像を削除
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            連絡先情報
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
            {/* 自宅 */}
            <div>
              <h4 className="font-semibold text-sm mb-2">自宅</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-800 mb-1">住所（改行可能）</label>
                  <textarea
                    value={contactInfo.home?.address || ''}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        home: { ...contactInfo.home, address: e.target.value },
                      })
                    }
                    rows={3}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md resize-y text-gray-900"
                    placeholder="住所を入力（Enterキーで改行できます）"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-800 mb-1">電話</label>
                  <input
                    type="tel"
                    value={contactInfo.home?.phone || ''}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        home: { ...contactInfo.home, phone: e.target.value },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                    placeholder="電話番号を入力"
                  />
                </div>
              </div>
            </div>

            {/* 恭彦連絡先 */}
            <div>
              <h4 className="font-semibold text-sm mb-2">恭彦連絡先</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-800 mb-1">Eメール</label>
                  <input
                    type="email"
                    value={contactInfo.takahiko.email}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        takahiko: { ...contactInfo.takahiko, email: e.target.value },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                    placeholder="takanag@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-800 mb-1">携帯</label>
                  <input
                    type="tel"
                    value={contactInfo.takahiko.phone}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        takahiko: { ...contactInfo.takahiko, phone: e.target.value },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                    placeholder="090-3319-3166"
                  />
                </div>
              </div>
            </div>

            {/* 樹連絡先 */}
            <div>
              <h4 className="font-semibold text-sm mb-2">樹連絡先</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-800 mb-1">Eメール</label>
                  <input
                    type="email"
                    value={contactInfo.itsuki.email}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        itsuki: { ...contactInfo.itsuki, email: e.target.value },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                    placeholder="itsukinag@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-800 mb-1">携帯</label>
                  <input
                    type="tel"
                    value={contactInfo.itsuki.phone}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        itsuki: { ...contactInfo.itsuki, phone: e.target.value },
                      })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                    placeholder="080-1564-2938"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            住所・連絡先（従来形式、後方互換性のため、改行可能）
          </label>
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="住所・連絡先を入力してください（Enterキーで改行できます）"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="footerVisible"
            checked={footerVisible}
            onChange={(e) => setFooterVisible(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="footerVisible" className="text-sm font-medium text-gray-700">
            住所・連絡先を表示する
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}

