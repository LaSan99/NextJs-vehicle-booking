import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { vehicleId, startDate, endDate, phoneNumber, address } = await request.json();

    // Validate input
    if (!vehicleId || !startDate || !endDate || !phoneNumber || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if vehicle exists and is available
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (vehicle.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Vehicle is not available' },
        { status: 400 }
      );
    }

    // Create booking with new fields
    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        phoneNumber,
        address,
        userId,
        vehicleId,
        status: 'PENDING',
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}