import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { mkdir } from 'fs/promises';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(publicDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }

    // Create unique filename
    const fileName = `${uuidv4()}_${file.name}`;
    const filePath = path.join(publicDir, fileName);
    
    await writeFile(filePath, buffer);
    
    // Return the URL that can be used to access the file
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 