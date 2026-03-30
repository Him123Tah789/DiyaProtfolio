import { NextResponse } from "next/server";

import { updateStoryInDb } from "@/lib/love-db";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { story?: unknown };
    const story = typeof payload.story === "string" ? payload.story.trim() : "";

    await updateStoryInDb(story);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to save story." }, { status: 500 });
  }
}
