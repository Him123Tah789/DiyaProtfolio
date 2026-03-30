import { NextResponse } from "next/server";

import { getLoveStoreFromDb } from "@/lib/love-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const store = await getLoveStoreFromDb();
    return NextResponse.json(store);
  } catch {
    return NextResponse.json({ message: "Failed to fetch love data." }, { status: 500 });
  }
}
