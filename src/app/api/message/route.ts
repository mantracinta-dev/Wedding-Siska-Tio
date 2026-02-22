import { NextResponse } from "next/server";

import {
  fetchMessage,
  listMessages,
  saveMessage,
} from "@/lib/repository/messages";

const MAX_MESSAGE_LENGTH = 300;
const MAX_NAME_LENGTH = 60;

type IncomingPayload = {
  guestSlug?: string;
  name?: string;
  message?: string;
};

const sanitize = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  let payload: IncomingPayload;

  try {
    payload = (await request.json()) as IncomingPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const guestSlug = sanitize(payload.guestSlug).toLowerCase();
  const name = sanitize(payload.name);
  const message = sanitize(payload.message);

  const errors: Record<string, string> = {};
  if (!guestSlug) errors.guestSlug = "Slug required";
  if (!name) errors.name = "Nama wajib diisi";
  if (!message) errors.message = "Ucapan wajib diisi";
  if (name.length > MAX_NAME_LENGTH) errors.name = "Nama terlalu panjang";
  if (message.length > MAX_MESSAGE_LENGTH) errors.message = "Ucapan terlalu panjang";

  if (Object.keys(errors).length) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const sanitizedMessage = message.replace(/\s+/g, " ").trim();
  const result = await saveMessage({ guestSlug, name, message: sanitizedMessage });

  return NextResponse.json({ success: true, persisted: result.persisted });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("guestSlug")?.toLowerCase() ?? "";
  if (slug) {
    const record = await fetchMessage(slug);
    return NextResponse.json({ success: true, data: record });
  }

  const records = await listMessages();
  return NextResponse.json({ success: true, data: records });
}
