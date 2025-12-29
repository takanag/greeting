import { createClient } from '@supabase/supabase-js';

// サーバーサイドでのみ使用（RLS をバイパス）
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

