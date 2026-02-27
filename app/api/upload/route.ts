import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (buffer.length === 0) {
            return NextResponse.json({ error: 'File is empty' }, { status: 400 });
        }

        // Save with timestamp and sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-').replace(/-+/g, '-');
        const fileName = `${Date.now()}-${safeName}`;
        const path = join(process.cwd(), 'public', 'uploads', fileName);

        await writeFile(path, buffer);

        console.log(`Uploaded file: ${fileName} (${buffer.length} bytes)`);

        return NextResponse.json({ url: `/uploads/${fileName}` });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
