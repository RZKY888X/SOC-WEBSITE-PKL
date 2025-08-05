// lib/db.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const POSTGRES_URL = "postgresql://neondb_owner:npg_CWzy2j5KvPJu@ep-summer-bonus-a10phwsn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const isSSL = POSTGRES_URL.includes("sslmode=require");

const { Pool } = (await import("pg")).default;
const pool = new Pool({
  connectionString: POSTGRES_URL,
  ...(isSSL && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// ✅ Koneksi manual (pakai pg)
export const rawQuery = (text, params) => pool.query(text, params);

// ✅ Koneksi pakai Prisma ORM
export { prisma };
