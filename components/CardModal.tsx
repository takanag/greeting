'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CardModal({
  imageUrl,
  thumbnailUrl,
  title,
  priority = false,
}: {
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  priority?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <button
        onClick={() => setIsOpen(true)}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onCopy={handleCopy}
        className="w-full relative aspect-video overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity select-none"
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 800px"
          priority={priority}
          draggable={false}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
          onContextMenu={handleContextMenu}
          onCopy={handleCopy}
        >
          <button
            className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-md font-semibold text-base md:text-lg shadow-lg transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
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
              src={imageUrl}
              alt={title}
              fill
              className="object-contain pointer-events-none"
              sizes="100vw"
              priority
              draggable={false}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
          </div>
        </div>
      )}
    </>
  );
}

