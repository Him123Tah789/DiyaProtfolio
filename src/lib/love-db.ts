import "server-only";

import { del } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

import type { LoveImage, LoveStore, MemoryEntry } from "@/lib/love-store";

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("POSTGRES_URL or DATABASE_URL is required for love database access.");
  }

  return neon(connectionString);
};

let isSchemaReady = false;

const ensureSchema = async () => {
  if (isSchemaReady) {
    return;
  }

  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS love_profile (
      id SMALLINT PRIMARY KEY,
      story TEXT NOT NULL DEFAULT ''
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS love_memories (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS love_images (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      caption TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    INSERT INTO love_profile (id, story)
    VALUES (1, '')
    ON CONFLICT (id) DO NOTHING;
  `;

  isSchemaReady = true;
};

const normalizeDate = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date().toISOString();
};

export const getLoveStoreFromDb = async (): Promise<LoveStore> => {
  await ensureSchema();
  const sql = getSql();

  const profileRows = (await sql`
    SELECT story FROM love_profile WHERE id = 1;
  `) as Array<{ story: string }>;

  const [profile] = profileRows;

  const memoriesRows = (await sql`
    SELECT id, text, created_at
    FROM love_memories
    ORDER BY created_at DESC;
  `) as Array<{ id: string; text: string; created_at: string | Date }>;

  const imageRows = (await sql`
    SELECT id, url, caption, created_at
    FROM love_images
    ORDER BY created_at DESC;
  `) as Array<{ id: string; url: string; caption: string; created_at: string | Date }>;

  const memories: MemoryEntry[] = memoriesRows.map((row) => ({
    id: row.id,
    text: row.text,
    createdAt: normalizeDate(row.created_at),
  }));

  const images: LoveImage[] = imageRows.map((row) => ({
    id: row.id,
    url: row.url,
    caption: row.caption,
    createdAt: normalizeDate(row.created_at),
  }));

  return {
    story: profile?.story ?? "",
    memories,
    images,
  };
};

export const updateStoryInDb = async (story: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    UPDATE love_profile
    SET story = ${story}
    WHERE id = 1;
  `;
};

export const addMemoryToDb = async (id: string, text: string, createdAt: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO love_memories (id, text, created_at)
    VALUES (${id}, ${text}, ${createdAt});
  `;
};

export const deleteMemoryFromDb = async (id: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    DELETE FROM love_memories
    WHERE id = ${id};
  `;
};

export const addImageToDb = async (id: string, url: string, caption: string, createdAt: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO love_images (id, url, caption, created_at)
    VALUES (${id}, ${url}, ${caption}, ${createdAt});
  `;
};

export const deleteImageFromDb = async (id: string) => {
  await ensureSchema();
  const sql = getSql();

  const existingRows = (await sql`
    SELECT url
    FROM love_images
    WHERE id = ${id};
  `) as Array<{ url: string }>;

  const [existing] = existingRows;

  await sql`
    DELETE FROM love_images
    WHERE id = ${id};
  `;

  if (existing?.url) {
    await del(existing.url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }
};
