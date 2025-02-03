import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this line to make the route dynamic
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    const bookingId = params.bookingId;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Error updating booking' },
      { status: 500 }
    );
  }
}

const bookings = await prisma.booking.findMany({
  include: {
    user: {
      select: {
        name: true,
        email: true,
      },
    },
    vehicle: {
      select: {
        name: true,
        model: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
}); 