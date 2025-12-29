'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/types/database';
import ImageUploader from './ImageUploader';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export default function CardEditor({
  yearId,
  card,
  onSave,
  onCancel,
  englishEnabled = false,
}: {
  yearId: string;
  card?: Card;
  onSave: () => void;
  onCancel: () => void;
  englishEnabled?: boolean;
}) {
  const [title, setTitle] = useState(card?.title || '');
  const [byText, setByText] = useState(card?.by_text || '');
  const [month, setMonth] = useState<typeof MONTHS[number]>(card?.month || 'January');
  const [description, setDescription] = useState(card?.description || '');
  const [imageUrl, setImageUrl] = useState(card?.image_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(card?.thumbnail_url || '');
  const [titleEn, setTitleEn] = useState(card?.title_en || '');
  const [descriptionEn, setDescriptionEn] = useState(card?.description_en || '');
  const [byTextEn, setByTextEn] = useState(card?.by_text_en || '');
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

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setByText(card.by_text);
      setMonth(card.month);
      setDescription(card.description);
      setImageUrl(card.image_url);
      setThumbnailUrl(card.thumbnail_url);
      setTitleEn(card.title_en || '');
      setDescriptionEn(card.description_en || '');
      setByTextEn(card.by_text_en || '');
    } else {
      // 新規作成時は空にする
      setTitle('');
      setByText('');
      setMonth('January');
      setDescription('');
      setImageUrl('');
      setThumbnailUrl('');
      setTitleEn('');
      setDescriptionEn('');
      setByTextEn('');
    }
  }, [card]);

  // 英語版が有効で、英語フィールドが空の場合に自動翻訳
  useEffect(() => {
    if (englishEnabled && card && (!titleEn || !descriptionEn)) {
      const autoTranslate = async () => {
        setTranslating(true);
        try {
          const [translatedTitle, translatedDescription, translatedByText] = await Promise.all([
            titleEn || !title ? titleEn : translateText(title),
            descriptionEn || !description ? descriptionEn : translateText(description),
            byTextEn || !byText ? byTextEn : translateText(byText),
          ]);

          if (translatedTitle && !titleEn) {
            setTitleEn(translatedTitle);
          }
          if (translatedDescription && !descriptionEn) {
            setDescriptionEn(translatedDescription);
          }
          if (translatedByText && !byTextEn) {
            setByTextEn(translatedByText);
          }
        } catch (error) {
          console.error('Auto-translation error:', error);
        } finally {
          setTranslating(false);
        }
      };

      autoTranslate();
    }
  }, [englishEnabled, card?.id]); // カードが変更されたときのみ実行

  const handleSave = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    setSaving(true);
    try {
      if (card) {
        // 更新
        const { error } = await supabase
          .from('cards')
          .update({
            title,
            by_text: byText,
            month,
            description,
            image_url: imageUrl,
            thumbnail_url: thumbnailUrl,
            title_en: englishEnabled ? (titleEn || null) : null,
            description_en: englishEnabled ? (descriptionEn || null) : null,
            by_text_en: englishEnabled ? (byTextEn || null) : null,
          })
          .eq('id', card.id);

        if (error) throw error;
      } else {
        // 新規作成
        const { data: existingCards } = await supabase
          .from('cards')
          .select('display_order')
          .eq('year_id', yearId)
          .order('display_order', { ascending: false })
          .limit(1)
          .single();

        const nextOrder = existingCards ? existingCards.display_order + 1 : 0;

        const { error } = await supabase
          .from('cards')
          .insert({
            year_id: yearId,
            title,
            by_text: byText,
            month,
            description,
            image_url: imageUrl,
            thumbnail_url: thumbnailUrl,
            display_order: nextOrder,
            title_en: englishEnabled ? (titleEn || null) : null,
            description_en: englishEnabled ? (descriptionEn || null) : null,
            by_text_en: englishEnabled ? (byTextEn || null) : null,
          });

        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      alert('保存に失敗しました: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (image: string, thumbnail: string) => {
    setImageUrl(image);
    setThumbnailUrl(thumbnail);
  };

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-300 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          By
        </label>
        <input
          type="text"
          value={byText}
          onChange={(e) => setByText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
        />
        {englishEnabled && (
          <input
            type="text"
            value={byTextEn}
            onChange={(e) => setByTextEn(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-blue-300 rounded-md text-gray-900 text-sm"
            placeholder="By (English)"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          月
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value as typeof MONTHS[number])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明文（改行可能）
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y text-gray-900"
          placeholder="説明文を入力してください（Enterキーで改行できます）"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          画像
        </label>
        <ImageUploader
          onUpload={handleImageUpload}
          currentImageUrl={imageUrl}
          currentThumbnailUrl={thumbnailUrl}
        />
      </div>

      {englishEnabled && (
        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">英語版</h3>
            {translating && (
              <span className="text-xs text-gray-500">翻訳中...</span>
            )}
            {!translating && (!titleEn || !descriptionEn) && (title || description) && (
              <button
                type="button"
                onClick={async () => {
                  setTranslating(true);
                  try {
                    const [translatedTitle, translatedDescription, translatedByText] = await Promise.all([
                      titleEn || !title ? titleEn : translateText(title),
                      descriptionEn || !description ? descriptionEn : translateText(description),
                      byTextEn || !byText ? byTextEn : translateText(byText),
                    ]);

                    if (translatedTitle && !titleEn) {
                      setTitleEn(translatedTitle);
                    }
                    if (translatedDescription && !descriptionEn) {
                      setDescriptionEn(translatedDescription);
                    }
                    if (translatedByText && !byTextEn) {
                      setByTextEn(translatedByText);
                    }
                  } catch (error) {
                    console.error('Translation error:', error);
                    alert('翻訳に失敗しました。手動で入力してください。');
                  } finally {
                    setTranslating(false);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                日本語から自動翻訳
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル（英語）
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Title (English)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明文（英語、改行可能）
              </label>
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y text-gray-900"
                placeholder="Description (English, press Enter for new line)"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

