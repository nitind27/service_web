import { clearAuthCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully',
  });
  response.headers.set('Set-Cookie', clearAuthCookie());
  return response;
}
