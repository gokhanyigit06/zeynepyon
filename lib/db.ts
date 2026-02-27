import { query } from './pg-db';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getSiteData() {
    // Try to fetch from DB
    try {
        const res = await query('SELECT value FROM key_value_store WHERE key = $1', ['site_data']);
        if (res.rowCount && res.rowCount > 0) {
            return res.rows[0].value;
        }
    } catch (e) {
        console.warn("DB connecting warning in getSiteData: Database may be offline, falling back to local file.");
    }

    // Fallback: try reading from live_data.json file if DB fails or is empty
    try {
        const filePath = join(process.cwd(), 'live_data.json');
        const fileContent = await readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (fallbackError) {
        console.error("Fallback Failed: Could not read live_data.json", fallbackError);
        return {};
    }
}

export async function updateSiteData(newData: any) {
    try {
        // Read current data from DB to merge
        const currentData = await getSiteData();
        const updatedData = { ...currentData, ...newData };

        // Write back to DB
        await query(
            'INSERT INTO key_value_store (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
            ['site_data', updatedData]
        );

        return updatedData;
    } catch (e) {
        console.error("DB Error in updateSiteData:", e);
        throw e;
    }
}
