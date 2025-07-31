import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to add Supabase credentials?",
  );
}

// Construct PostgreSQL connection string from Supabase URL
const supabaseUrl = new URL(process.env.SUPABASE_URL);
const connectionString = `postgresql://postgres.${supabaseUrl.hostname.split('.')[0]}:[YOUR-PASSWORD]@${supabaseUrl.hostname}:5432/postgres`;

// Use DATABASE_URL if available (from Supabase connection string), otherwise construct from SUPABASE_URL
const dbUrl = process.env.DATABASE_URL || connectionString;

export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle({ client: pool, schema });