import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5434/zeynep_db",
});

export async function query(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
}


export async function initDb() {
    await query(`
    CREATE TABLE IF NOT EXISTS key_value_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
  `);

    // Check if data exists, if not, try to seed from file (optional future step)
    const res = await query('SELECT * FROM key_value_store WHERE key = $1', ['site_data']);
    if (res.rowCount === 0) {
        // We will handle seeding via a script, but this ensures table exists
        console.log('Key-value store initialized. Data needs to be migrated.');
    }
}
