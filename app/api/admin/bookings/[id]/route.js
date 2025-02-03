import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    const bookingId = params.id;

    // Get the booking with vehicle details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        user: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        vehicle: true,
        user: true,
      },
    });

    // If booking is approved, update vehicle status to BOOKED
    if (status === 'APPROVED') {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'BOOKED' },
      });
    }

    // If booking is rejected or cancelled, ensure vehicle is AVAILABLE
    if (status === 'REJECTED' || status === 'CANCELLED') {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    // Create a log entry
    await prisma.log.create({
      data: {
        action: 'UPDATE_BOOKING',
        description: `Booking for ${booking.vehicle.name} by ${booking.user.name} ${status.toLowerCase()}`,
        userId: user.id,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
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
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const bookingId = params.id;

    // Get the booking details before deletion
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        user: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // If the booking was approved, update vehicle status back to AVAILABLE
    if (booking.status === 'APPROVED') {
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    // Create a log entry
    await prisma.log.create({
      data: {
        action: 'DELETE_BOOKING',
        description: `Booking for ${booking.vehicle.name} by ${booking.user.name} was deleted`,
        userId,
      },
    });

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 