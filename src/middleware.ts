import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const CANONICAL_HOST = 'fortunecookie.ai.kr';

export async function middleware(request: NextRequest) {
  const { hostname, protocol, pathname, search } = request.nextUrl;

  // Redirect www → non-www (canonical domain)
  if (hostname === `www.${CANONICAL_HOST}`) {
    return NextResponse.redirect(
      `${protocol}//${CANONICAL_HOST}${pathname}${search}`,
      301,
    );
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|json|txt|xml|webmanifest)$).*)',
  ],
};
