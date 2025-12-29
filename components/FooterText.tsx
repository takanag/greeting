'use client';

export default function FooterText({ text }: { text: string }) {
  // コピーイベントを無効化
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  // 右クリックメニューを無効化（オプション）
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="text-center text-sm text-gray-600 whitespace-pre-line select-none"
      onCopy={handleCopy}
      onContextMenu={handleContextMenu}
    >
      {text}
    </div>
  );
}

