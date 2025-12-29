'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import YearEditor from '@/components/admin/YearEditor';
import CardList from '@/components/admin/CardList';
import PreviewPanel from '@/components/admin/PreviewPanel';
import { YearWithCards } from '@/types/database';

export default function AdminPage() {
  const [years, setYears] = useState<YearWithCards[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadYears();
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    if (selectedYearId) {
      loadYearData(selectedYearId);
    }
  }, [selectedYearId]);

  const loadCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        setCurrentUser(user);
        // 管理者判定（簡易版：メールアドレスで判定）
        // 本番環境では、より安全な方法（サーバー側での判定）を推奨
        // 注意: この判定は表示用のみ。実際のアクセス制御はRLSポリシーで行われる
        const adminEmails = ['takanag@gmail.com']; // 管理者のメールアドレスを設定
        setIsAdmin(adminEmails.includes(user.email || ''));
      }
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  };

  const loadYears = async () => {
    try {
      if (!currentUser) {
        setYears([]);
        setLoading(false);
        return;
      }

      // 管理者の場合はすべてのページを取得、一般ユーザーは自分のページのみ
      let query = supabase
        .from('years')
        .select('*')
        .order('year', { ascending: false });

      // 管理者でない場合は、自分のuser_idでフィルタリング
      if (!isAdmin) {
        query = query.eq('user_id', currentUser.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setYears(data as any);
        if (!selectedYearId) {
          setSelectedYearId(data[0].id);
        }
      } else {
        setYears([]);
        setSelectedYearId(null);
        setSelectedYear(null);
      }
    } catch (err) {
      console.error('Error loading years:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadYearData = async (yearId: string) => {
    try {
      const { data: yearData, error: yearError } = await supabase
        .from('years')
        .select('*')
        .eq('id', yearId)
        .single();

      if (yearError) throw yearError;

      // アクセス制御: 管理者でない場合、自分のページのみアクセス可能
      if (!isAdmin && yearData.user_id !== currentUser.id) {
        console.error('Access denied: This page belongs to another user');
        alert('このページは他のユーザーのページです。アクセスできません。');
        // 自分のページのみを再読み込み
        await loadYears();
        return;
      }

      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('year_id', yearId)
        .order('display_order', { ascending: true });

      if (cardsError) throw cardsError;

      setSelectedYear({
        ...yearData,
        cards: cards || [],
      } as YearWithCards);
    } catch (err) {
      console.error('Error loading year data:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/greeting/admin/login');
  };

  const handleYearChange = (yearId: string) => {
    setSelectedYearId(yearId);
  };

  const handleYearUpdate = () => {
    if (selectedYearId) {
      loadYearData(selectedYearId);
    }
    loadYears();
  };

  const handleCardUpdate = () => {
    if (selectedYearId) {
      loadYearData(selectedYearId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-900">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">管理画面</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ログアウト
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ユーザー情報表示 */}
        {currentUser && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              ログインユーザー: <span className="font-semibold">{currentUser.email}</span>
              {isAdmin && <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">管理者</span>}
            </p>
          </div>
        )}

        {/* 年度選択 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年度を選択
          </label>
          {years.length === 0 ? (
            <p className="text-sm text-gray-800 mb-2">管理できる年度がありません。</p>
          ) : (
            <select
              value={selectedYearId || ''}
              onChange={(e) => handleYearChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}年 {year.user_id === currentUser?.id ? '(自分のページ)' : isAdmin ? '(他ユーザーのページ)' : ''}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => {
              const newYear = prompt('新しい年度を入力してください（例: 2027）');
              if (newYear) {
                const yearNum = parseInt(newYear, 10);
                if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
                  alert('有効な年度を入力してください（2000-2100）');
                  return;
                }
                createNewYear(yearNum);
              }
            }}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            新規年度を作成
          </button>
        </div>

        {selectedYear && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左側: 編集パネル */}
            <div className="space-y-6">
              <YearEditor
                year={selectedYear}
                onUpdate={handleYearUpdate}
              />
              <CardList
                yearId={selectedYear.id}
                cards={selectedYear.cards}
                onUpdate={handleCardUpdate}
              />
            </div>

            {/* 右側: プレビュー */}
            <div className="lg:sticky lg:top-6 h-fit">
              <PreviewPanel year={selectedYear} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  async function createNewYear(year: number) {
    try {
      if (!currentUser) {
        alert('ユーザー情報が取得できませんでした。再ログインしてください。');
        return;
      }

      // データベースのデフォルト値に依存（title_text は DB のデフォルト値が使用される）
      // user_id は RLS ポリシーの WITH CHECK により自動的に現在のユーザーIDが設定される
      const { data, error } = await supabase
        .from('years')
        .insert({
          year,
          user_id: currentUser.id, // 現在のユーザーIDを設定
          // greeting_text, footer_text, footer_visible は DB のデフォルト値に依存
          // title_text も DB のデフォルト値（'明けましておめでとうございます'）が使用される
        })
        .select()
        .single();

      if (error) throw error;

      await loadYears();
      if (data) {
        setSelectedYearId(data.id);
      }
    } catch (err: any) {
      alert('年度の作成に失敗しました: ' + err.message);
    }
  }
}

