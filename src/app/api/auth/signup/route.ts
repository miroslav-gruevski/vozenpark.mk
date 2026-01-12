import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Apply stricter rate limiting for signup - 3 attempts per 5 minutes
  const ip = getClientIP(request);
  const rateLimitResult = checkRateLimit(`signup:${ip}`, RATE_LIMIT_CONFIGS.strict);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many signup attempts. Please try again later.' },
      { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await request.json();
    const { email, password, language = 'mk' } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        language,
      },
    });

    // Create and set JWT token
    const token = createToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
