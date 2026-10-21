import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return apiError('No file uploaded', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return apiError('File size exceeds maximum 5MB limit', 400);
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Clean filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return apiSuccess({ url: publicUrl, filename }, 'File uploaded successfully', 201);
  } catch (error) {
    console.error('File upload error:', error);
    return apiError('Failed to process file upload', 500);
  }
}
