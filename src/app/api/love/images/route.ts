import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { addImageToDb, deleteImageFromDb } from "@/lib/love-db";

export const runtime = "nodejs";

type UploadPayload = {
  id?: unknown;
  caption?: unknown;
  createdAt?: unknown;
  dataUrl?: unknown;
};

const dataUrlToBuffer = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL");
  }

  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");
  return { mimeType, buffer };
};

const extensionFromMime = (mimeType: string) => {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  if (mimeType === "image/gif") {
    return "gif";
  }

  return "bin";
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as UploadPayload;

    const id = typeof payload.id === "string" ? payload.id : "";
    const caption = typeof payload.caption === "string" ? payload.caption.trim() : "Our beautiful memory";
    const createdAt =
      typeof payload.createdAt === "string" ? payload.createdAt : new Date().toISOString();
    const dataUrl = typeof payload.dataUrl === "string" ? payload.dataUrl : "";

    if (!id || !dataUrl) {
      return NextResponse.json({ message: "Invalid image payload." }, { status: 400 });
    }

    const { mimeType, buffer } = dataUrlToBuffer(dataUrl);
    const extension = extensionFromMime(mimeType);
    const fileName = `love-images/${id}.${extension}`;

    const blob = await put(fileName, buffer, {
      access: "public",
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });

    await addImageToDb(id, blob.url, caption, createdAt);

    return NextResponse.json({
      id,
      url: blob.url,
      caption,
      createdAt,
    });
  } catch {
    return NextResponse.json({ message: "Failed to upload image." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";

    if (!id) {
      return NextResponse.json({ message: "Image id is required." }, { status: 400 });
    }

    await deleteImageFromDb(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete image." }, { status: 500 });
  }
}
