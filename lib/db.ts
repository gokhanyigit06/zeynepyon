import { query } from './pg-db';

export async function getSiteData() {
    // Try to fetch from DB
    try {
        const res = await query('SELECT value FROM key_value_store WHERE key = $1', ['site_data']);
        if (res.rowCount && res.rowCount > 0) {
            return res.rows[0].value;
        }
    } catch (e) {
        console.error("DB Error in getSiteData:", e);
    }

    // Fallback: return empty object or error, but for now let's hope migration worked.
    return {};
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
