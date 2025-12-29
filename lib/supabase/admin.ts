import { createClient } from '@supabase/supabase-js';

// サーバーサイドでのみ使用（RLS をバイパス）
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in your environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

