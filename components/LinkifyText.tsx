'use client';

import React from 'react';

// URLを検出してリンクに変換する関数
function linkify(text: string): React.ReactNode[] {
  // URLの正規表現パターン（http://, https://, www.で始まるURL）
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    // URLの前のテキストを追加
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // URLをリンクに変換
    let url = match[0];
    let href = url;
    
    // www.で始まる場合はhttps://を追加
    if (url.startsWith('www.')) {
      href = `https://${url}`;
    }

    parts.push(
      <a
        key={match.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline break-all"
      >
        {url}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // マッチがない場合は元のテキストをそのまま返す
  if (parts.length === 0) {
    return [text];
  }

  return parts;
}

// 改行を保持しながらURLをリンクに変換するコンポーネント
export default function LinkifyText({ text }: { text: string }) {
  if (!text) return null;

  // 改行で分割して、各行を処理
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {linkify(line)}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

