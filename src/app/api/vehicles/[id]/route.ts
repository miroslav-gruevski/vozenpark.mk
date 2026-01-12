import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { plate, regExpiry, insExpiry, inspExpiry } = body;

    // Check if vehicle exists and belongs to user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingVehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    // Check if new plate conflicts with another vehicle
    if (plate && plate.toUpperCase() !== existingVehicle.plate) {
      const plateConflict = await prisma.vehicle.findFirst({
        where: {
          userId: user.id,
          plate: plate.toUpperCase(),
          id: { not: id },
        },
      });

      if (plateConflict) {
        return NextResponse.json(
          { message: 'This plate is already registered' },
          { status: 400 }
        );
      }
    }

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plate: plate?.toUpperCase() || existingVehicle.plate,
        regExpiry: regExpiry ? new Date(regExpiry) : existingVehicle.regExpiry,
        insExpiry: insExpiry ? new Date(insExpiry) : existingVehicle.insExpiry,
        inspExpiry: inspExpiry ? new Date(inspExpiry) : existingVehicle.inspExpiry,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if vehicle exists and belongs to user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingVehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
