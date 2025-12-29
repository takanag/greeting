'use client';

import { ContactInfo as ContactInfoType } from '@/types/database';

export default function ContactInfo({ contactInfo }: { contactInfo: ContactInfoType }) {
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
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 select-none"
      onCopy={handleCopy}
      onContextMenu={handleContextMenu}
    >
      {/* 自宅 */}
      <div className="text-center md:text-left">
        <h3 className="text-lg font-bold mb-3 text-gray-800">自宅</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {contactInfo.home?.address && (
            <li className="whitespace-pre-line">{contactInfo.home.address}</li>
          )}
          {contactInfo.home?.phone && (
            <li>電話: {contactInfo.home.phone}</li>
          )}
        </ul>
      </div>

      {/* 恭彦連絡先 */}
      <div className="text-center md:text-left">
        <h3 className="text-lg font-bold mb-3 text-gray-800">恭彦連絡先</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {contactInfo.takahiko.email && (
            <li>Eメール: {contactInfo.takahiko.email}</li>
          )}
          {contactInfo.takahiko.phone && (
            <li>携帯: {contactInfo.takahiko.phone}</li>
          )}
        </ul>
      </div>

      {/* 樹連絡先 */}
      <div className="text-center md:text-left">
        <h3 className="text-lg font-bold mb-3 text-gray-800">樹連絡先</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {contactInfo.itsuki.email && (
            <li>Eメール: {contactInfo.itsuki.email}</li>
          )}
          {contactInfo.itsuki.phone && (
            <li>携帯: {contactInfo.itsuki.phone}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

