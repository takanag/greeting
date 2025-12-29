'use client';

import { YearWithCards } from '@/types/database';
import Image from 'next/image';
import { useState } from 'react';

export default function PreviewPanel({ year }: { year: YearWithCards }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 右クリックメニューを無効化
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // ドラッグを無効化
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  // コピーを無効化
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">プレビュー</h2>
      <div className="border border-gray-300 rounded-lg bg-white max-h-[80vh] overflow-y-auto">
        {/* ヘッダー背景画像 */}
        {year.header_background_url && (
          <div className="relative w-full h-[8.64rem] overflow-hidden">
            <Image
              src={year.header_background_url}
              alt="Header background"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-[0.875rem] font-bold text-white mb-1 drop-shadow-lg">
                {year.title_text}
              </h1>
              {year.greeting_text && (
                <div className="text-[0.6125rem] text-white whitespace-pre-line drop-shadow-md">
                  {year.greeting_text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 背景画像がない場合のフォールバック */}
        {!year.header_background_url && (
          <div className="bg-gradient-to-b from-blue-400 to-blue-600 py-6 text-center">
            <h1 className="text-[0.875rem] font-bold text-white mb-1">
              {year.title_text}
            </h1>
            {year.greeting_text && (
              <div className="text-[0.6125rem] text-white whitespace-pre-line">
                {year.greeting_text}
              </div>
            )}
          </div>
        )}

        <div className="p-4">

        {/* カード一覧 */}
        <div className="space-y-6">
          {year.cards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="mb-2">
                  <h2 className="text-xl font-bold">{card.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold">{card.month}</span>
                    {card.by_text && <span>By {card.by_text}</span>}
                  </div>
                </div>

                {card.thumbnail_url && (
                  <div className="mb-2">
                    <button
                      onClick={() => setSelectedImage(card.image_url)}
                      onContextMenu={handleContextMenu}
                      onDragStart={handleDragStart}
                      onCopy={handleCopy}
                      className="w-full relative aspect-video overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity select-none"
                    >
                      <Image
                        src={card.thumbnail_url}
                        alt={card.title}
                        fill
                        className="object-cover pointer-events-none"
                        sizes="(max-width: 768px) 100vw, 400px"
                        draggable={false}
                        onContextMenu={handleContextMenu}
                        onDragStart={handleDragStart}
                      />
                    </button>
                  </div>
                )}

                {card.description && (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {card.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        {year.footer_visible && (
          <div className="mt-8 pt-4 border-t border-gray-300">
            {/* 連絡先情報（3列レイアウト） */}
            {year.contact_info && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* 自宅 */}
                <div className="text-center">
                  <h3 className="text-xs font-bold mb-1 text-gray-800">自宅</h3>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {year.contact_info.home?.address && (
                      <li className="whitespace-pre-line">{year.contact_info.home.address}</li>
                    )}
                    {year.contact_info.home?.phone && (
                      <li>電話: {year.contact_info.home.phone}</li>
                    )}
                  </ul>
                </div>

                {/* 恭彦連絡先 */}
                <div className="text-center">
                  <h3 className="text-xs font-bold mb-1 text-gray-800">恭彦連絡先</h3>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {year.contact_info.takahiko.email && (
                      <li>Eメール: {year.contact_info.takahiko.email}</li>
                    )}
                    {year.contact_info.takahiko.phone && (
                      <li>携帯: {year.contact_info.takahiko.phone}</li>
                    )}
                  </ul>
                </div>

                {/* 樹連絡先 */}
                <div className="text-center">
                  <h3 className="text-xs font-bold mb-1 text-gray-800">樹連絡先</h3>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {year.contact_info.itsuki.email && (
                      <li>Eメール: {year.contact_info.itsuki.email}</li>
                    )}
                    {year.contact_info.itsuki.phone && (
                      <li>携帯: {year.contact_info.itsuki.phone}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* 従来の footer_text */}
            {year.footer_text && (
              <div className="text-center text-xs text-gray-600 whitespace-pre-line">
                {year.footer_text}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* 画像拡大表示 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          onContextMenu={handleContextMenu}
          onCopy={handleCopy}
        >
          <button
            className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-md font-semibold text-base md:text-lg shadow-lg transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ← 戻る
          </button>
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full select-none"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            onCopy={handleCopy}
          >
            <Image
              src={selectedImage}
              alt="Preview"
              fill
              className="object-contain pointer-events-none"
              sizes="100vw"
              draggable={false}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
          </div>
        </div>
      )}
    </div>
  );
}

