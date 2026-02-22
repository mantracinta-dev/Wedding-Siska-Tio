"use client";

import { PenLine, Send } from "lucide-react";

import {
  GUESTBOOK_LIMITS,
  useGuestbookViewModel,
} from "@/features/guestbook/useGuestbookViewModel";

type GuestbookProps = {
  guestSlug: string;
  guestName: string;
};

export default function Guestbook({ guestSlug, guestName }: GuestbookProps) {
  const {
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
  } = useGuestbookViewModel({ guestSlug, guestName });
  const hasError = !name.trim() || !message.trim();

  return (
    <div className="w-full rounded-3xl bg-white/70 p-6 shadow-card backdrop-blur">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sand-700">
          Guestbook
        </p>
        <h3 className="text-2xl font-semibold text-ink-900">
          Kirim ucapan untuk Siska & Tio
        </h3>
        <p className="text-sm text-ink-500">
          Satu tamu satu pesan. Kamu bisa edit ucapan kapan saja.
        </p>
      </div>

      {entry && !isEditing ? (
        <div className="mt-6 rounded-2xl border border-sand-200 bg-sand-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-ink-900">{entry.name}</p>
              <p className="mt-2 text-sm leading-6 text-ink-500">{entry.message}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-sand-700">
                Terakhir diperbarui
              </p>
              <p className="text-xs text-ink-500">
                {new Date(entry.updatedAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:-translate-y-0.5 hover:shadow"
            >
              <PenLine className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-ink-700">Nama</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition focus:border-sand-400"
              placeholder="Nama lengkap"
              maxLength={60}
              required
            />
          </div>
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-ink-700">Ucapan</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[140px] w-full resize-none rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition focus:border-sand-400"
              placeholder="Tulis ucapan manis untuk pengantin"
              maxLength={GUESTBOOK_LIMITS.maxMessage}
              required
            />
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Maksimal {GUESTBOOK_LIMITS.maxMessage} karakter</span>
              <span>{remaining} tersisa</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || hasError}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
          </button>
        </form>
      )}

      {messages.length > 0 && (
        <div className="mt-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
            Ucapan Tamu Lain
          </p>
          <div className="space-y-4">
            {messages.map((item) => (
              <div
                key={item.guestSlug}
                className="rounded-3xl border border-sand-200 bg-white/80 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-ink-900">{item.name}</p>
                <p className="mt-2 text-sm leading-6 text-ink-500">{item.message}</p>
                {item.updatedAt && (
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-sand-700">
                    {new Date(item.updatedAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
