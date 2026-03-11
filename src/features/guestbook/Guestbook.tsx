"use client";

import { PenLine, Send, AlertCircle } from "lucide-react";
import {
  GUESTBOOK_LIMITS,
  useGuestbookViewModel,
} from "@/features/guestbook/useGuestbookViewModel";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type GuestbookProps = {
  guestSlug: string;
  guestName: string;
};

function MessageSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-sand-200 bg-white/60 p-5">
      <div className="h-3 w-1/3 rounded-full bg-sand-200" />
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-full rounded-full bg-sand-100" />
        <div className="h-2.5 w-4/5 rounded-full bg-sand-100" />
      </div>
      <div className="mt-4 h-2 w-1/4 rounded-full bg-sand-100" />
    </div>
  );
}

export default function Guestbook({ guestSlug, guestName }: GuestbookProps) {
  const {
    entry,
    isEditing,
    isSubmitting,
    submitError,
    isLoadingFeed,
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

  // Filter out own message from the "other guests" list
  const otherMessages = messages.filter((item) => item.guestSlug !== guestSlug);

  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entry && !isEditing && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)" },
      );
    }
  }, [entry, isEditing]);

  return (
    <div className="w-full rounded-3xl bg-white/70 py-6 overflow-hidden shadow-card backdrop-blur">
      <div className="flex flex-col gap-2 px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sand-700">
          Guestbook
        </p>
        <h3 className="text-2xl font-semibold text-ink-900">
          Kirim ucapan untuk Siska &amp; Tio
        </h3>
        <p className="text-sm text-ink-500">
          Satu tamu satu pesan. Kamu bisa edit ucapan kapan saja.
        </p>
      </div>

      {entry && !isEditing ? (
        <div
          ref={successRef}
          className="mt-6 mx-6 rounded-2xl border border-sand-200 bg-sand-50 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-ink-900">{entry.name}</p>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                {entry.message}
              </p>
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
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 px-6">
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

          {submitError && (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

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

      <div className="mt-12 w-full overflow-hidden">
        <p className="mb-6 px-6 text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
          Ucapan Tamu Lain
        </p>

        {isLoadingFeed ? (
          <div className="flex gap-4 px-6 overflow-hidden">
            <div className="w-[300px] shrink-0">
              <MessageSkeleton />
            </div>
            <div className="w-[300px] shrink-0">
              <MessageSkeleton />
            </div>
            <div className="w-[300px] shrink-0">
              <MessageSkeleton />
            </div>
          </div>
        ) : otherMessages.length > 0 ? (
          <div className="relative flex w-full overflow-hidden">
            {/* Animasi berjalan 2 kelompok identik (duplikasi) supaya seamlessly looping */}
            <div className="flex w-max min-w-full shrink-0 animate-marquee items-start gap-4 px-4 hover:pause-animation">
              {/* Grup A (Original) */}
              {otherMessages.map((item) => (
                <div
                  key={`a-${item.guestSlug}`}
                  className="w-[320px] shrink-0 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm whitespace-normal transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-base font-semibold text-ink-900 font-display">
                    {item.name}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink-500 line-clamp-5">
                    "{item.message}"
                  </p>
                  {item.updatedAt && (
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-sand-500">
                      {new Date(item.updatedAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </p>
                  )}
                </div>
              ))}

              {/* Grup B (Clone, menyatu dalam 1 kontainer berjalan) */}
              {otherMessages.map((item) => (
                <div
                  key={`b-${item.guestSlug}`}
                  className="w-[320px] shrink-0 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm whitespace-normal transition hover:-translate-y-1 hover:shadow-md"
                  aria-hidden="true"
                >
                  <p className="text-base font-semibold text-ink-900 font-display">
                    {item.name}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink-500 line-clamp-5">
                    "{item.message}"
                  </p>
                  {item.updatedAt && (
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-sand-500">
                      {new Date(item.updatedAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="px-6 text-sm text-ink-400">
            Belum ada ucapan dari tamu lain. Jadilah yang pertama!
          </p>
        )}
      </div>
    </div>
  );
}
