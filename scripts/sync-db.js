const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://zeynepyon.com/api/content';
const DATA_FILE = path.join(__dirname, '..', 'data', 'site-data.json');

console.log('🔄 Syncing data from ' + API_URL + '...');

https.get(API_URL, (res) => {
    if (res.statusCode !== 200) {
        console.error('❌ Failed to fetch data: StatusCode ' + res.statusCode);
        res.resume();
        return;
    }

    let rawData = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', async () => {
        try {
            const parsedData = JSON.parse(rawData);

            // Connect to Local DB
            const { Pool } = require('pg');
            const pool = new Pool({
                connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5434/zeynep_db",
            });

            console.log('💾 Inserting/Updating data into Local PostgreSQL...');
            const client = await pool.connect();
            await client.query(
                'INSERT INTO key_value_store (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
                ['site_data', parsedData]
            );

            client.release();
            await pool.end();
            console.log('✅ Successfully synced data from Live Site to Local PostgreSQL');
        } catch (e) {
            console.error('❌ Error syncing data: ' + e.message);
        }
    });
}).on('error', (e) => {
    console.error('❌ Got error: ' + e.message);
});
