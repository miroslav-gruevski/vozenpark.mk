import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

// Demo account credentials - works without database
const DEMO_EMAIL = 'demo@vozenpark.mk';
const DEMO_PASSWORD = 'demo123';
const DEMO_USER_ID = 'demo-user-id';

export async function POST(request: Request) {
  // Apply rate limiting - 5 attempts per minute
  const ip = getClientIP(request);
  const rateLimitResult = checkRateLimit(`login:${ip}`, RATE_LIMIT_CONFIGS.auth);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many login attempts. Please try again later.' },
      { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const emailLower = email.toLowerCase();

    // Special case: Demo account works without database
    if (emailLower === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const token = createToken({ userId: DEMO_USER_ID, email: DEMO_EMAIL });
      await setAuthCookie(token);
      return NextResponse.json(
        { success: true },
        { headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Create and set JWT token
    const token = createToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
