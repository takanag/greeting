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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">管理画面ログイン</h1>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
}

