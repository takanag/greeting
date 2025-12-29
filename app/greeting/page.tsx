import Link from 'next/link';

export default function GreetingTopPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Greeting Page作成
        </h1>
        
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
  );
}

