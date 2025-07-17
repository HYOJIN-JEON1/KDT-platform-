import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 API 보호
  if (pathname.startsWith('/api/admin')) {
    const adminToken = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET_KEY;

    // 1. 관리자 토큰 확인
    if (!adminToken || !adminSecret) {
      return NextResponse.json(
        { error: '인증되지 않은 접근입니다.' },
        { status: 401 }
      );
    }

    // 2. Bearer 토큰 형식 확인
    if (!adminToken.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '잘못된 토큰 형식입니다.' },
        { status: 401 }
      );
    }

    const token = adminToken.substring(7);
    
    // 3. 토큰 검증
    if (token !== adminSecret) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 403 }
      );
    }

    // 4. IP 화이트리스트 확인 (선택사항)
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') ||
                    'unknown';
    
    const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
    
    if (allowedIPs.length > 0 && clientIP && !allowedIPs.includes(clientIP)) {
      console.log(`🚫 차단된 IP 접근 시도: ${clientIP}`);
      return NextResponse.json(
        { error: '허용되지 않은 IP입니다.' },
        { status: 403 }
      );
    }

    // 5. 요청 로깅
    console.log(`🔑 관리자 API 접근: ${pathname} from ${clientIP}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*']
}; 