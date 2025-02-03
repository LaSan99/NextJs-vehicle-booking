import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Log the connection attempt
    console.log('Attempting database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    const { name, email, password } = await request.json();
    console.log('Received registration request for:', email);

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Error registering user', 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}