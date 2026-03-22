import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    
    // 만약 로그인된 상태(세션 쿠키 존재)인데 로그인 페이지로 접근하려고 하면 대시보드로 튕겨냅니다.
    if (sessionCookie && request.nextUrl.pathname.startsWith('/summonday/login')) {
        return NextResponse.redirect(new URL('/summonday/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * 다음 경로들에서 미들웨어를 실행합니다:
         * - /summonday/login
         */
        '/summonday/login(.*)',
    ],
};
