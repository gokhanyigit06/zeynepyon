import { NextResponse } from 'next/server';
import { getSiteData, updateSiteData } from '@/lib/db';

export async function GET() {
    try {
        const data = await getSiteData();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newData = await request.json();
        const updated = await updateSiteData(newData);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}
