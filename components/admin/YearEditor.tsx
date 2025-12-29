'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { YearWithCards, ContactInfo } from '@/types/database';
import HeaderImageUploader from './HeaderImageUploader';

// 既存のデータをcontacts配列に変換する関数（既存データを保持）
function normalizeContactInfo(contactInfo: ContactInfo | null): ContactInfo {
  if (!contactInfo) {
    return {
      home: { address: '', phone: '' },
      contacts: [
        { name: '', email: '', phone: '' },
        { name: '', email: '', phone: '' },
      ],
      contact_count: 2,
      home_en: { address: '' },
      contacts_en: [{ name: '' }, { name: '' }],
    };
  }

  // 既にcontacts配列がある場合はそのまま返す（homeも保持）
  if (contactInfo.contacts && Array.isArray(contactInfo.contacts)) {
    return {
      home: contactInfo.home || { address: '', phone: '' },
      contacts: contactInfo.contacts,
      contact_count: contactInfo.contact_count ?? (contactInfo.contacts.length || 2),
      // 後方互換性のため、既存のtakahikoとitsukiも保持
      takahiko: contactInfo.takahiko,
      itsuki: contactInfo.itsuki,
      // 英語版の連絡先情報
      home_en: contactInfo.home_en || { address: '' },
      contacts_en: contactInfo.contacts_en || contactInfo.contacts.map(() => ({ name: '' })),
    };
  }

  // 既存のtakahikoとitsukiをcontacts配列に変換（既存データを保持）
  const contacts = [];
  if (contactInfo.takahiko) {
    contacts.push({
      name: contactInfo.takahiko.name || '',
      email: contactInfo.takahiko.email || '',
      phone: contactInfo.takahiko.phone || '',
    });
  }
  if (contactInfo.itsuki) {
    contacts.push({
      name: contactInfo.itsuki.name || '',
      email: contactInfo.itsuki.email || '',
      phone: contactInfo.itsuki.phone || '',
    });
  }

  // デフォルトで2つの連絡先を確保（既存データがある場合はそのまま使用）
  while (contacts.length < 2) {
    contacts.push({ name: '', email: '', phone: '' });
  }

  return {
    home: contactInfo.home || { address: '', phone: '' },
    contacts,
    contact_count: contactInfo.contact_count ?? (contacts.length || 2),
    // 後方互換性のため、既存のtakahikoとitsukiも保持
    takahiko: contactInfo.takahiko,
    itsuki: contactInfo.itsuki,
    // 英語版の連絡先情報
    home_en: contactInfo.home_en || { address: '' },
    contacts_en: contactInfo.contacts_en || contacts.map(() => ({ name: '' })),
  };
}

export default function YearEditor({
  year,
  onUpdate,
  onEnglishEnabledChange,
}: {
  year: YearWithCards;
  onUpdate: () => void;
  onEnglishEnabledChange?: (enabled: boolean) => void;
}) {
  const [titleText, setTitleText] = useState(year.title_text);
  const [greetingText, setGreetingText] = useState(year.greeting_text);
  const [headerBackgroundUrl, setHeaderBackgroundUrl] = useState(year.header_background_url || '');
  const [footerText, setFooterText] = useState(year.footer_text);
  const [footerVisible, setFooterVisible] = useState(year.footer_visible);
  const [englishEnabled, setEnglishEnabled] = useState(year.english_enabled || false);
  const [titleTextEn, setTitleTextEn] = useState(year.title_text_en || '');
  const [greetingTextEn, setGreetingTextEn] = useState(year.greeting_text_en || '');
  const [footerTextEn, setFooterTextEn] = useState(year.footer_text_en || '');
  
  // 連絡先情報を正規化（既存データを保持）
  const normalizedContactInfo = normalizeContactInfo(year.contact_info);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(normalizedContactInfo);
  const [contactCount, setContactCount] = useState(normalizedContactInfo.contact_count || 2);
  
  // yearが変更されたときに状態を更新（データの再読み込み時）
  useEffect(() => {
    setTitleText(year.title_text);
    setGreetingText(year.greeting_text);
    setHeaderBackgroundUrl(year.header_background_url || '');
    setFooterText(year.footer_text);
    setFooterVisible(year.footer_visible);
    setEnglishEnabled(year.english_enabled || false);
    setTitleTextEn(year.title_text_en || '');
    setGreetingTextEn(year.greeting_text_en || '');
    setFooterTextEn(year.footer_text_en || '');
    const normalized = normalizeContactInfo(year.contact_info);
    setContactInfo(normalized);
    setContactCount(normalized.contact_count || 2);
  }, [year.id, year.title_text, year.greeting_text, year.header_background_url, year.footer_text, year.footer_visible, year.english_enabled, year.title_text_en, year.greeting_text_en, year.footer_text_en, JSON.stringify(year.contact_info)]);
  
  // 連絡先の数が変更されたときに、contacts配列を調整
  useEffect(() => {
    const currentContacts = contactInfo.contacts || [];
    const newContacts = [...currentContacts];
    
    // 連絡先の数が増えた場合、空の連絡先を追加
    while (newContacts.length < contactCount) {
      newContacts.push({ name: '', email: '', phone: '' });
    }
    
    // 連絡先の数が減った場合、余分な連絡先を削除
    while (newContacts.length > contactCount) {
      newContacts.pop();
    }
    
    setContactInfo({
      ...contactInfo,
      contacts: newContacts,
      contact_count: contactCount,
    });
  }, [contactCount]);
  
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const supabase = createClient();

  // 翻訳関数
  const translateText = async (text: string): Promise<string> => {
    if (!text.trim()) return '';
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLang: 'en' }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // エラー時は元のテキストを返す
    }
  };

  // このuseEffectは削除（チェックボックスのonChangeで直接処理するため）

  const handleSave = async () => {
    setSaving(true);
    try {
      // contact_infoに英語版のデータを含める
      const contactInfoToSave = {
        ...contactInfo,
        // 英語版が有効な場合のみ英語版のデータを含める
        ...(englishEnabled && {
          home_en: contactInfo.home_en || { address: '' },
          contacts_en: contactInfo.contacts_en || [],
        }),
      };

      const { error } = await supabase
        .from('years')
        .update({
          title_text: titleText,
          greeting_text: greetingText,
          header_background_url: headerBackgroundUrl || null,
          footer_text: footerText,
          footer_visible: footerVisible,
          contact_info: contactInfoToSave,
          english_enabled: englishEnabled,
          title_text_en: englishEnabled ? (titleTextEn || null) : null,
          greeting_text_en: englishEnabled ? (greetingTextEn || null) : null,
          footer_text_en: englishEnabled ? (footerTextEn || null) : null,
        })
        .eq('id', year.id);

      if (error) throw error;

      onUpdate();
      alert('保存しました');
    } catch (err: any) {
      alert('保存に失敗しました: ' + err.message);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateContact = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    const newContacts = [...(contactInfo.contacts || [])];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value,
    };
    setContactInfo({
      ...contactInfo,
      contacts: newContacts,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Greeting Pageの編集</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル
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
            挨拶文（改行可能）
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              連絡先情報
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">連絡先の数:</label>
              <select
                value={contactCount}
                onChange={(e) => setContactCount(parseInt(e.target.value, 10))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}個
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={`grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-md ${
            contactCount === 1 ? 'md:grid-cols-2' :
            contactCount === 2 ? 'md:grid-cols-3' :
            contactCount === 3 ? 'md:grid-cols-4' :
            contactCount === 4 ? 'md:grid-cols-5' :
            'md:grid-cols-6'
          }`}>
            {/* 自宅 */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-900">自宅</h4>
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
                  {englishEnabled && (
                    <textarea
                      value={contactInfo.home_en?.address || ''}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          home_en: { address: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-2 py-1 text-xs mt-1 border border-blue-300 rounded-md resize-y text-gray-900"
                      placeholder="Address (English, press Enter for new line)"
                    />
                  )}
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

            {/* 連絡先（動的） */}
            {(contactInfo.contacts || []).slice(0, contactCount).map((contact, index) => (
              <div key={index}>
                <h4 className="font-semibold text-sm mb-2 text-gray-900">連絡先 {index + 1}</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-800 mb-1">名前</label>
                    <input
                      type="text"
                      value={contact.name || ''}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                      placeholder="名前を入力"
                    />
                    {englishEnabled && (
                      <input
                        type="text"
                        value={contactInfo.contacts_en?.[index]?.name || ''}
                        onChange={(e) => {
                          const newContactsEn = [...(contactInfo.contacts_en || [])];
                          while (newContactsEn.length <= index) {
                            newContactsEn.push({ name: '' });
                          }
                          newContactsEn[index] = { name: e.target.value };
                          setContactInfo({
                            ...contactInfo,
                            contacts_en: newContactsEn,
                          });
                        }}
                        className="w-full px-2 py-1 text-xs mt-1 border border-blue-300 rounded-md text-gray-900"
                        placeholder="Name (English)"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-800 mb-1">Eメール</label>
                    <input
                      type="email"
                      value={contact.email || ''}
                      onChange={(e) => updateContact(index, 'email', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-800 mb-1">携帯</label>
                    <input
                      type="tel"
                      value={contact.phone || ''}
                      onChange={(e) => updateContact(index, 'phone', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-900"
                      placeholder="090-1234-5678"
                    />
                  </div>
                </div>
              </div>
            ))}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-900"
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

        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="englishEnabled"
              checked={englishEnabled}
              onChange={async (e) => {
                const newValue = e.target.checked;
                setEnglishEnabled(newValue);
                // 親コンポーネントに通知
                if (onEnglishEnabledChange) {
                  onEnglishEnabledChange(newValue);
                }
                
                // チェックを入れたとき、英語フィールドが空の場合は自動翻訳
                if (newValue && (!titleTextEn || !greetingTextEn || !footerTextEn)) {
                  setTranslating(true);
                  try {
                    const [translatedTitle, translatedGreeting, translatedFooter] = await Promise.all([
                      titleTextEn || !titleText ? titleTextEn : translateText(titleText),
                      greetingTextEn || !greetingText ? greetingTextEn : translateText(greetingText),
                      footerTextEn || !footerText ? footerTextEn : translateText(footerText),
                    ]);

                    if (translatedTitle && !titleTextEn) {
                      setTitleTextEn(translatedTitle);
                    }
                    if (translatedGreeting && !greetingTextEn) {
                      setGreetingTextEn(translatedGreeting);
                    }
                    if (translatedFooter && !footerTextEn) {
                      setFooterTextEn(translatedFooter);
                    }
                  } catch (error) {
                    console.error('Auto-translation error:', error);
                  } finally {
                    setTranslating(false);
                  }
                }
              }}
              className="mr-2"
            />
            <label htmlFor="englishEnabled" className="text-sm font-medium text-gray-700">
              英語版を作成する
            </label>
            {translating && (
              <span className="ml-2 text-xs text-gray-500">翻訳中...</span>
            )}
          </div>

          {englishEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル（英語）
                </label>
                <input
                  type="text"
                  value={titleTextEn}
                  onChange={(e) => setTitleTextEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Title (English)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  挨拶文（英語、改行可能）
                </label>
                <textarea
                  value={greetingTextEn}
                  onChange={(e) => setGreetingTextEn(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-900"
                  placeholder="Greeting text (English, press Enter for new line)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所・連絡先（英語、改行可能）
                </label>
                <textarea
                  value={footerTextEn}
                  onChange={(e) => setFooterTextEn(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-900"
                  placeholder="Address and contact information (English, press Enter for new line)"
                />
              </div>
            </div>
          )}
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
