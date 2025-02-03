import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add this line to make the route dynamic
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get user ID from the request header (set by middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user data and their bookings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 