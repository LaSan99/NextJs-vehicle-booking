import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { comparePassword, generateToken } from '@/app/utils/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token with role
    const token = generateToken({
      userId: user.id,
      role: user.role  // Include role in token payload
    });

    // Create log entry
    await prisma.log.create({
      data: {
        action: 'LOGIN',
        description: `User ${email} logged in`,
        userId: user.id,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 