import { NextResponse } from "next/server";

import { addMemoryToDb, deleteMemoryFromDb } from "@/lib/love-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      id?: unknown;
      text?: unknown;
      createdAt?: unknown;
    };

    const id = typeof payload.id === "string" ? payload.id : "";
    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    const createdAt = typeof payload.createdAt === "string" ? payload.createdAt : new Date().toISOString();

    if (!id || !text) {
      return NextResponse.json({ message: "Invalid memory payload." }, { status: 400 });
    }

    await addMemoryToDb(id, text, createdAt);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to save memory." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";

    if (!id) {
      return NextResponse.json({ message: "Memory id is required." }, { status: 400 });
    }

    await deleteMemoryFromDb(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete memory." }, { status: 500 });
  }
}
