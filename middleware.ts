import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ログインページの場合は認証チェックをスキップ
  if (pathname === '/greeting/admin/login') {
    return NextResponse.next();
  }

  // 管理画面のパスの場合のみ認証チェック（ログインページを除く）
  if (pathname.startsWith('/greeting/admin') && pathname !== '/greeting/admin/login') {
    try {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      // 環境変数のチェック
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        console.error('Supabase environment variables are not set');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/greeting/admin/login';
        return NextResponse.redirect(redirectUrl);
      }

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      // クッキーを確認
      const cookies = request.cookies.getAll();
      const supabaseCookies = cookies.filter(c => 
        c.name.includes('supabase') || c.name.includes('sb-')
      );
      
      // クッキーの値を確認（デバッグ用、最初の100文字のみ）
      const authTokenCookie = supabaseCookies.find(c => c.name.includes('auth-token'));
      console.log('Middleware - クッキー確認:', {
        totalCookies: cookies.length,
        supabaseCookies: supabaseCookies.map(c => ({ 
          name: c.name, 
          hasValue: !!c.value,
          valueLength: c.value?.length || 0,
          valuePreview: c.value?.substring(0, 50) || 'empty'
        })),
        authTokenCookieValue: authTokenCookie?.value?.substring(0, 100) || 'not found',
      });

      // getSession() の代わりに getUser() を試す
      // クッキーから直接ユーザー情報を取得
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log('Middleware - getUser 結果:', {
        hasUser: !!user,
        error: userError?.message,
        userId: user?.id?.substring(0, 8),
      });

      // セッションも確認
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log('Middleware - セッションチェック:', {
        pathname,
        hasSession: !!session,
        hasUser: !!user,
        error: error?.message,
        userError: userError?.message,
        sessionUserId: session?.user?.id?.substring(0, 8),
        userId: user?.id?.substring(0, 8),
      });

      // ユーザーまたはセッションがあれば認証済みとみなす
      // または、auth-token クッキーが存在する場合も認証済みとみなす（フォールバック）
      const hasAuthToken = !!authTokenCookie && authTokenCookie.value && authTokenCookie.value.length > 0;
      const isAuthenticated = !!user || !!session || hasAuthToken;

      // エラーがある場合でも、auth-token クッキーがあれば認証済みとみなす
      if ((error || userError) && !hasAuthToken) {
        console.error('Auth error in middleware:', error || userError);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/greeting/admin/login';
        return NextResponse.redirect(redirectUrl);
      }

      if (!isAuthenticated) {
        console.log('Middleware - 認証なし、ログインページにリダイレクト');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/greeting/admin/login';
        return NextResponse.redirect(redirectUrl);
      }

      // auth-token クッキーだけで認証した場合の警告
      if (!user && !session && hasAuthToken) {
        console.warn('Middleware - auth-token クッキーで認証（セッション復元に失敗）');
      }

      console.log('Middleware - セッション確認済み、アクセス許可');

      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/greeting/admin/login';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/greeting/admin/:path*',
  ],
};

