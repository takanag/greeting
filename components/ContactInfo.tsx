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
      className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 select-none"
      onCopy={handleCopy}
      onContextMenu={handleContextMenu}
    >
      {/* 自宅 - 名刺カード */}
      {(contactInfo.home?.address || contactInfo.home?.phone) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">自宅</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {contactInfo.home?.address && (
                <div className="whitespace-pre-line leading-relaxed">
                  {contactInfo.home.address}
                </div>
              )}
              {contactInfo.home?.phone && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{contactInfo.home.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 恭彦連絡先 - 名刺カード */}
      {(contactInfo.takahiko.email || contactInfo.takahiko.phone) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">恭彦連絡先</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {contactInfo.takahiko.email && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium break-all">{contactInfo.takahiko.email}</span>
                </div>
              )}
              {contactInfo.takahiko.phone && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{contactInfo.takahiko.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 樹連絡先 - 名刺カード */}
      {(contactInfo.itsuki.email || contactInfo.itsuki.phone) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">樹連絡先</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {contactInfo.itsuki.email && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium break-all">{contactInfo.itsuki.email}</span>
                </div>
              )}
              {contactInfo.itsuki.phone && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{contactInfo.itsuki.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

