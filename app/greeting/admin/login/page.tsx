'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // エラーの種類に応じてユーザーフレンドリーなメッセージに変換
        let errorMessage = 'ログインに失敗しました。もう一度お試しください。';
        
        if (error.message === 'Invalid login credentials' || error.message.includes('Invalid')) {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'メールアドレスが確認されていません';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'ログイン試行回数が多すぎます。しばらく待ってから再度お試しください';
        }
        
        // エラーをスローせず、直接エラーメッセージを設定
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // ログイン成功後、セッションが確立されるまで少し待つ
      if (data.session) {
        // クッキーが確実に設定されるまで待機
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // セッションを再確認
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // セッションを明示的にリフレッシュ（クッキーを確実に設定）
          try {
            await supabase.auth.refreshSession(sessionData.session);
          } catch (refreshError) {
            // リフレッシュエラーは無視（セッションは既に有効）
          }
          
          // 完全なページリロードでリダイレクト
          window.location.replace('/greeting/admin');
        } else {
          throw new Error('セッションが設定されませんでした。もう一度お試しください。');
        }
      } else {
        throw new Error('セッションが作成されませんでした');
      }
    } catch (err: any) {
      // 予期しないエラーの場合のみ表示
      // Supabaseの認証エラーは既に上で処理されているため、ここに来ることは少ない
      const errorMessage = err.message || 'ログインに失敗しました。もう一度お試しください。';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">オンライン年賀状作成ページ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: Greeting Page紹介とログインフォーム */}
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

            {/* ログインフォーム */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-xl font-bold mb-6 text-center text-gray-900">「オンライン年賀状作成ページ」へのログイン</h1>
              <form 
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    パスワード
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'ログイン中...' : 'ログイン'}
                </button>
              </form>
            </div>
          </div>

          {/* 右側: サンプル画像 */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">オンライン年賀状サンプル</h3>
              <div className="flex justify-center">
                <div className="relative w-[52%] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src="/greeting-sample.png"
                    alt="Greeting Pageのサンプル"
                    className="w-full h-auto"
                    onError={(e) => {
                      // 画像が存在しない場合は非表示にする
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

