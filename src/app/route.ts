import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to the login page
  return NextResponse.redirect(new URL('/login', request.url));
}