import { supabase } from "@/lib/db";

export type MessageRecord = {
  guestSlug: string;
  name: string;
  message: string;
  updatedAt?: string;
};

const fallbackStore = new Map<string, MessageRecord>();

const mapValuesDescending = () =>
  Array.from(fallbackStore.values()).sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
  });

export async function saveMessage(record: MessageRecord) {
  const payload = {
    guest_slug: record.guestSlug,
    name: record.name,
    message: record.message,
    updated_at: record.updatedAt || new Date().toISOString(),
  };

  if (!supabase) {
    fallbackStore.set(record.guestSlug, { ...record, updatedAt: payload.updated_at });
    return { persisted: false, reason: "Supabase not configured" } as const;
  }

  const { error } = await supabase.from("messages").upsert(payload);

  if (error) {
    fallbackStore.set(record.guestSlug, { ...record, updatedAt: payload.updated_at });
    return { persisted: false, reason: error.message } as const;
  }

  return { persisted: true } as const;
}

export function getLocalMessage(slug: string) {
  return fallbackStore.get(slug) || null;
}

export async function fetchMessage(slug: string): Promise<MessageRecord | null> {
  if (!slug) return null;

  if (!supabase) {
    return fallbackStore.get(slug) || null;
  }

  const { data, error } = await supabase
    .from("messages")
    .select("guest_slug, name, message, updated_at")
    .eq("guest_slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    guestSlug: data.guest_slug,
    name: data.name,
    message: data.message,
    updatedAt: data.updated_at ?? undefined,
  };
}

export async function listMessages(limit = 50): Promise<MessageRecord[]> {
  if (!supabase) {
    return mapValuesDescending();
  }

  const { data, error } = await supabase
    .from("messages")
    .select("guest_slug, name, message, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return mapValuesDescending();
  }

  return data.map((row) => ({
    guestSlug: row.guest_slug,
    name: row.name,
    message: row.message,
    updatedAt: row.updated_at ?? undefined,
  }));
}
