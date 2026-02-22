"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type GuestbookEntry = {
  guestSlug: string;
  name: string;
  message: string;
  updatedAt: string;
};

const MAX_MESSAGE_LENGTH = 300;
const MAX_NAME_LENGTH = 60;

const storageKey = (slug: string) => `wedding-message-${slug}`;
const queueStorageKey = "wedding-message-queue";

const readStoredEntry = (slug: string): GuestbookEntry | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as GuestbookEntry) : null;
  } catch {
    return null;
  }
};

const persistEntry = (entry: GuestbookEntry) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(entry.guestSlug), JSON.stringify(entry));
  } catch {
    // ignore localStorage failure
  }
};

const queueEntry = (entry: GuestbookEntry) => {
  if (typeof window === "undefined") return;
  try {
    const existing = window.localStorage.getItem(queueStorageKey);
    const queue = existing ? (JSON.parse(existing) as GuestbookEntry[]) : [];
    queue.push(entry);
    window.localStorage.setItem(queueStorageKey, JSON.stringify(queue));
  } catch {
    // ignore queue failure
  }
};

type ViewModelProps = {
  guestSlug: string;
  guestName: string;
};

export function useGuestbookViewModel({ guestSlug, guestName }: ViewModelProps) {
  const [entry, setEntry] = useState<GuestbookEntry | null>(null);
  const [name, setName] = useState(guestName);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    setName(guestName);
  }, [guestName]);

  const applyEntry = useCallback((record: GuestbookEntry | null) => {
    if (!record) return;
    setEntry(record);
    setName(record.name);
    setMessage(record.message);
  }, []);

  const updateFeedWith = useCallback((record: GuestbookEntry) => {
    setMessages((prev) => {
      const filtered = prev.filter((item) => item.guestSlug !== record.guestSlug);
      return [record, ...filtered];
    });
  }, []);

  const loadFeed = useCallback(async () => {
    try {
      const response = await fetch("/api/message");
      const payload = await response.json().catch(() => null);
      if (payload?.data) {
        setMessages(payload.data as GuestbookEntry[]);
      }
    } catch {
      // ignore feed failure
    }
  }, []);

  const flushQueue = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(queueStorageKey);
      if (!raw) return;
      const queue = (JSON.parse(raw) as GuestbookEntry[]).filter(Boolean);
      if (!queue.length) return;

      const remaining: GuestbookEntry[] = [];
      for (const item of queue) {
        try {
          const response = await fetch("/api/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const result = await response.json().catch(() => null);
          if (!response.ok || !result?.persisted) {
            remaining.push(item);
          }
        } catch {
          remaining.push(item);
        }
      }

      if (remaining.length) {
        window.localStorage.setItem(queueStorageKey, JSON.stringify(remaining));
      } else {
        window.localStorage.removeItem(queueStorageKey);
      }
      await loadFeed();
    } catch {
      // ignore flush failure
    }
  }, [loadFeed]);

  useEffect(() => {
    const stored = readStoredEntry(guestSlug);
    if (stored) {
      applyEntry(stored);
    } else {
      setMessage("");
    }

    let cancelled = false;
    const fetchServerEntry = async () => {
      try {
        const response = await fetch(`/api/message?guestSlug=${encodeURIComponent(guestSlug)}`);
        const payload = await response.json().catch(() => null);
        if (!cancelled && payload?.data) {
          const remote: GuestbookEntry = {
            guestSlug: payload.data.guestSlug,
            name: payload.data.name,
            message: payload.data.message,
            updatedAt: payload.data.updatedAt || new Date().toISOString(),
          };
          applyEntry(remote);
          persistEntry(remote);
        }
      } catch {
        // ignore fetch failure
      }
    };

    fetchServerEntry();
    flushQueue();
    loadFeed();

    return () => {
      cancelled = true;
    };
  }, [applyEntry, flushQueue, guestSlug, loadFeed]);

  const remaining = useMemo(() => MAX_MESSAGE_LENGTH - message.length, [message]);

  const startEditing = () => setIsEditing(true);
  useEffect(() => {
    if (!isEditing || !entry) return;
    setName(entry.name);
    setMessage(entry.message);
  }, [entry, isEditing]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) return;
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) return;
    if (trimmedName.length > MAX_NAME_LENGTH) return;

    setIsSubmitting(true);
    const payload: GuestbookEntry = {
      guestSlug,
      name: trimmedName,
      message: trimmedMessage,
      updatedAt: new Date().toISOString(),
    };

    setEntry(payload);
    persistEntry(payload);
    updateFeedWith(payload);

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      const shouldQueue = !response.ok || !result?.success || result.persisted === false;

      if (shouldQueue) {
        queueEntry(payload);
      } else {
        await flushQueue();
        await loadFeed();
      }
    } catch {
      queueEntry(payload);
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  return {
    entry,
    isEditing,
    isSubmitting,
    name,
    message,
    remaining,
    setName,
    setMessage,
    startEditing,
    handleSubmit,
    messages,
  };
}

export const GUESTBOOK_LIMITS = {
  maxMessage: MAX_MESSAGE_LENGTH,
  maxName: MAX_NAME_LENGTH,
};
