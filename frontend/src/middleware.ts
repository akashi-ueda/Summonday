import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    
    // ログイン済み（セッションクッキーあり）の状態でログインページにアクセスしようとした場合、ダッシュボードにリダイレクトします。
    if (sessionCookie && request.nextUrl.pathname.startsWith('/summonday/login')) {
        return NextResponse.redirect(new URL('/summonday/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * 以下のパスでミドルウェアを実行します:
         * - /summonday/login
         */
        '/summonday/login(.*)',
    ],
};
