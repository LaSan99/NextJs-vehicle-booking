import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Edge-compatible token verification
export const verifyTokenEdge = (token) => {
  try {
    // Simple JWT validation for Edge runtime
    const [headerB64, payloadB64] = token.split('.');
    if (!headerB64 || !payloadB64) return null;

    // Decode payload
    const payload = JSON.parse(atob(payloadB64));
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Node.js token verification (for API routes)
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function verifyAuth(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    return user;
  } catch (error) {
    return null;
  } finally {
    await prisma.$disconnect();
  }
} 