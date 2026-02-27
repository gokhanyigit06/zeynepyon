import { query } from './pg-db';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getSiteData() {
    let baseData: any = {};

    // Always load live_data.json as a foundation/fallback to prevent missing components
    try {
        const filePath = join(process.cwd(), 'live_data.json');
        const fileContent = await readFile(filePath, 'utf-8');
        baseData = JSON.parse(fileContent);
    } catch (fallbackError) {
        console.error("Fallback Warning: Could not read live_data.json", fallbackError);
    }

    // Try to fetch overrides from DB
    try {
        const res = await query('SELECT value FROM key_value_store WHERE key = $1', ['site_data']);
        if (res.rowCount && res.rowCount > 0) {
            const dbData = res.rows[0].value || {};

            // Deep merge essential sections to prevent empty sections from db wiping live data
            return {
                ...baseData,
                ...dbData,
                hero: { ...(baseData.hero || {}), ...(dbData.hero || {}) },
                branding: { ...(baseData.branding || {}), ...(dbData.branding || {}) },
                book: { ...(baseData.book || {}), ...(dbData.book || {}) },
                footer: { ...(baseData.footer || {}), ...(dbData.footer || {}) },
                contact: { ...(baseData.contact || {}), ...(dbData.contact || {}) },
                testimonials: dbData.testimonials?.length ? dbData.testimonials : baseData.testimonials,
                newsArticles: dbData.newsArticles?.length ? dbData.newsArticles : baseData.newsArticles,
                audioStories: dbData.audioStories?.length ? dbData.audioStories : baseData.audioStories,
            };
        }
    } catch (e) {
        console.warn("DB connecting warning in getSiteData: Database may be offline, falling back entirely to local file.");
    }

    return baseData;

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
