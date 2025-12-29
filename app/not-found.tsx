import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">ページが見つかりませんでした。</p>
        <div className="space-y-4">
          <p className="text-gray-600">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <Link
            href="/greeting"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

