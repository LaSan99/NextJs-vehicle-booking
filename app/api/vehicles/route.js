import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, model, year, licensePlate, images, pricePerDay, seatCount } = await request.json();

    // Validate input
    if (!name || !model || !year || !licensePlate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create vehicle with images
    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        model,
        year,
        licensePlate,
        pricePerDay: pricePerDay || 0,
        seatCount: seatCount || 4,
        images: {
          create: images?.map(url => ({ url })) || []
        }
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Error creating vehicle', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        images: true
      }
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Error fetching vehicles', details: error.message },
      { status: 500 }
    );
  }
} 