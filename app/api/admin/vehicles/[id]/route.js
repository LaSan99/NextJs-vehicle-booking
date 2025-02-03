import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/app/utils/auth';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the user is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    const vehicleId = params.id;

    // Update vehicle status
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status },
    });

    // Create a log entry
    await prisma.log.create({
      data: {
        action: 'UPDATE_VEHICLE',
        description: `Vehicle ${updatedVehicle.name} status updated to ${status}`,
        userId: user.id,
      },
    });

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const vehicleId = params.id;

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { bookings: true }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Check if vehicle has active bookings
    const hasActiveBookings = vehicle.bookings.some(
      booking => ['PENDING', 'APPROVED'].includes(booking.status)
    );

    if (hasActiveBookings) {
      return NextResponse.json(
        { error: 'Cannot delete vehicle with active bookings' },
        { status: 400 }
      );
    }

    // Delete the vehicle and its associated images
    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });

    // Create a log entry
    await prisma.log.create({
      data: {
        action: 'DELETE_VEHICLE',
        description: `Vehicle ${vehicle.name} (${vehicle.licensePlate}) was deleted`,
        userId,
      },
    });

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 