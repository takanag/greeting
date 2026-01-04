import { redirect } from 'next/navigation';

export default function Home() {
  // デフォルトで最新年度にリダイレクト
  // TODO: 最新年度を動的に取得する実装を追加
  redirect('/greeting/2026');
}


