import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get user role from the request header (set by middleware)
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { name, model, year, licensePlate, images, pricePerDay, seatCount } = data;

    // Validate input
    if (!name || !model || !year || !licensePlate || pricePerDay === undefined || seatCount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields', 
          received: { name, model, year, licensePlate, pricePerDay, seatCount }
        },
        { status: 400 }
      );
    }

    // Check if license plate is already in use
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'License plate already exists' },
        { status: 400 }
      );
    }

    // Create new vehicle with images
    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        model,
        year: parseInt(year),
        licensePlate,
        pricePerDay: parseFloat(pricePerDay),
        seatCount: parseInt(seatCount),
        status: 'AVAILABLE',
        images: {
          create: images?.map(url => ({
            url
          })) || []
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