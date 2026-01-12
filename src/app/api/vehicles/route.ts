import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plate, regExpiry, insExpiry, inspExpiry } = body;

    // Validate input
    if (!plate || !regExpiry || !insExpiry || !inspExpiry) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if plate already exists for this user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        userId: user.id,
        plate: plate.toUpperCase(),
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { message: 'This plate is already registered' },
        { status: 400 }
      );
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        plate: plate.toUpperCase(),
        regExpiry: new Date(regExpiry),
        insExpiry: new Date(insExpiry),
        inspExpiry: new Date(inspExpiry),
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Create vehicle error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
