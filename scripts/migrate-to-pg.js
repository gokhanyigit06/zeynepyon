const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://user:password@localhost:5434/zeynep_db';
const pool = new Pool({ connectionString });

const DATA_FILE = path.join(__dirname, '..', 'data', 'site-data.json');

async function migrate() {
    try {
        console.log('🔄 Connecting to DB...');
        const client = await pool.connect();

        console.log('🏗️ Creating table if not exists...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS key_value_store (
                key TEXT PRIMARY KEY,
                value JSONB NOT NULL
            );
        `);

        console.log('📖 Reading JSON file...');
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const jsonData = JSON.parse(data);

        console.log('💾 Inserting/Updating data into DB...');
        const queryText = 'INSERT INTO key_value_store (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value';
        await client.query(queryText, ['site_data', jsonData]);

        console.log('✅ Migration successful! Data is now in PostgreSQL.');
        client.release();
        process.exit(0);
    } catch (e) {
        console.error('❌ Migration failed:', e);
        process.exit(1);
    }
}

migrate();
