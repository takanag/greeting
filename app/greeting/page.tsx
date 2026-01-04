import Link from 'next/link';
import SampleImage from '@/components/SampleImage';

export default function GreetingTopPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">オンライン年賀状作成ページ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: Greeting Page紹介とログイン・登録ボタン */}
          <div className="flex flex-col gap-6">
            {/* Greeting Page紹介セクション */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-center text-gray-900">「オンライン年賀状作成ページ」でできること</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>SNSなどで共有できるオンライン年賀状を簡単に作成・公開できます</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>写真を追加して、写真ごとにメッセージを添えられます</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>タイトルや挨拶文を自由に編集できます</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span>英語版も自動翻訳で簡単に作成できます</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">✓</span>
                  <span><code className="bg-gray-100 px-1 rounded">/greeting/(ユーザー名)/(年度)/</code> の形式で専用のページを作成できます</span>
                </div>
              </div>
            </div>

            {/* ログイン・登録ボタン */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold mb-6 text-center text-gray-900">Greeting Page作成</h2>
              
              <div className="space-y-4">
                <Link
                  href="/greeting/signup"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  新規利用登録
                </Link>
                
                <Link
                  href="/greeting/admin/login"
                  className="block w-full bg-gray-600 text-white text-center py-3 px-6 rounded-md hover:bg-gray-700 transition-colors font-semibold"
                >
                  ログイン
                </Link>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-800">
                <p>既にアカウントをお持ちの方は「ログイン」を、</p>
                <p>新規でアカウントを作成する方は「新規利用登録」をクリックしてください。</p>
              </div>
            </div>
          </div>

          {/* 右側: サンプル画像 */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">オンライン年賀状サンプル</h3>
              <SampleImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

