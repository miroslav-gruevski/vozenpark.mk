import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { language } = body;

    if (!language || !['en', 'mk', 'sq', 'tr', 'sr'].includes(language)) {
      return NextResponse.json(
        { message: 'Invalid language' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { language },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update language error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
