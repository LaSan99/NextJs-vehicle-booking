import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get user role from the request header (set by middleware)
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all data needed for the dashboard
    const [users, vehicles, bookings] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          vehicle: true,
        },
      }),
    ]);

    return NextResponse.json({
      users,
      vehicles,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 