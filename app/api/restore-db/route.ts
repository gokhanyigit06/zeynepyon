import { NextResponse } from "next/server";
import { query } from "@/lib/pg-db";

const SECRET_KEY = "ZeynepYon2026RestoreKey"; // Simple hardcoded key for one-time use

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { key, data } = body;

        if (key !== SECRET_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!data) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        // Initialize table if not exists (safety check)
        await query(`
            CREATE TABLE IF NOT EXISTS key_value_store (
                key TEXT PRIMARY KEY,
                value JSONB NOT NULL
            );
        `);

        // Insert/Update data
        await query(
            'INSERT INTO key_value_store (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
            ['site_data', data]
        );

        return NextResponse.json({ success: true, message: "Data restored successfully" });
    } catch (e: any) {
        console.error("Restore error:", e);
        return NextResponse.json({ error: e.message || "Internal Error" }, { status: 500 });
    }
}
