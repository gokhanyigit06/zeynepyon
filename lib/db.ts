import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'site-data.json');

export async function getSiteData() {
    const file = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(file);
}

export async function updateSiteData(newData: any) {
    // Read current data first to merge (optional, but safer)
    const currentData = await getSiteData();
    const updatedData = { ...currentData, ...newData };
    await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf8');
    return updatedData;
}
