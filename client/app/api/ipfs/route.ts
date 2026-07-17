import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileUrl: string;

    try {
      // Save locally to public/uploads when running on Node server
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(file.name) || '.png';
      const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${Date.now()}_${safeName}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.promises.writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    } catch {
      // Fallback for read-only serverless environments (e.g. Vercel)
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/png';
      fileUrl = `data:${mimeType};base64,${base64}`;
    }

    return NextResponse.json({ 
      success: true, 
      ipfsHash: fileUrl
    });
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}


