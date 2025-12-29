'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function ImageUploader({
  onUpload,
  currentImageUrl,
  currentThumbnailUrl,
}: {
  onUpload: (imageUrl: string, thumbnailUrl: string) => void;
  currentImageUrl?: string;
  currentThumbnailUrl?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 画像ファイルかチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'アップロードに失敗しました');
      }

      const { imageUrl, thumbnailUrl } = await response.json();
      onUpload(imageUrl, thumbnailUrl);
    } catch (err: any) {
      setError(err.message || 'アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>アップロード中...</div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'ここに画像をドロップ'
                : '画像をドラッグ&ドロップ、またはクリックして選択'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPEG, PNG, GIF, WebP 対応
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {currentThumbnailUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-1">現在の画像:</p>
          <div className="relative w-32 h-20 rounded overflow-hidden">
            <Image
              src={currentThumbnailUrl}
              alt="Current thumbnail"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        </div>
      )}
    </div>
  );
}

