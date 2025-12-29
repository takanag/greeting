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
}: {
  yearId: string;
  card?: Card;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(card?.title || '');
  const [byText, setByText] = useState(card?.by_text || '');
  const [month, setMonth] = useState<typeof MONTHS[number]>(card?.month || 'January');
  const [description, setDescription] = useState(card?.description || '');
  const [imageUrl, setImageUrl] = useState(card?.image_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(card?.thumbnail_url || '');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

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
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          月
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value as typeof MONTHS[number])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
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

