"use client";

import {
  PenLine,
  Send,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  GUESTBOOK_LIMITS,
  useGuestbookViewModel,
} from "@/features/guestbook/useGuestbookViewModel";
import { useEffect, useRef, useState } from "react";
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
  const recentMessages = otherMessages.slice(0, 5);

  const [showAllMessages, setShowAllMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(otherMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = otherMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const successRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const midItemRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (entry && !isEditing && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)" },
      );
    }
  }, [entry, isEditing]);

  useEffect(() => {
    if (showAllMessages) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 40; // Kecepatan gerak lambat

    const autoScroll = (time: number) => {
      const iter = time - lastTime;
      lastTime = time;

      if (
        !isDragging.current &&
        !isHovered.current &&
        marqueeRef.current &&
        firstItemRef.current &&
        midItemRef.current
      ) {
        marqueeRef.current.scrollLeft += (speed * iter) / 1000;

        const loopWidth =
          midItemRef.current.offsetLeft - firstItemRef.current.offsetLeft;

        // Reset scroll menyambung loop
        if (marqueeRef.current.scrollLeft >= loopWidth) {
          marqueeRef.current.scrollLeft -= loopWidth;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [recentMessages.length, showAllMessages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (marqueeRef.current) {
      startX.current = e.pageX - marqueeRef.current.offsetLeft;
      scrollLeft.current = marqueeRef.current.scrollLeft;
      marqueeRef.current.style.cursor = "grabbing";
      marqueeRef.current.style.userSelect = "none";
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    isHovered.current = false;
    if (marqueeRef.current) {
      marqueeRef.current.style.cursor = "grab";
      marqueeRef.current.style.userSelect = "auto";
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (marqueeRef.current) {
      marqueeRef.current.style.cursor = "grab";
      marqueeRef.current.style.userSelect = "auto";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      !isDragging.current ||
      !marqueeRef.current ||
      !firstItemRef.current ||
      !midItemRef.current
    )
      return;
    e.preventDefault();
    const x = e.pageX - marqueeRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    marqueeRef.current.scrollLeft = scrollLeft.current - walk;

    const loopWidth =
      midItemRef.current.offsetLeft - firstItemRef.current.offsetLeft;

    if (marqueeRef.current.scrollLeft <= 0) {
      marqueeRef.current.scrollLeft += loopWidth;
      scrollLeft.current += loopWidth;
    } else if (marqueeRef.current.scrollLeft >= loopWidth) {
      marqueeRef.current.scrollLeft -= loopWidth;
      scrollLeft.current -= loopWidth;
    }
  };

  const isGenericGuest = guestSlug === "tamu" || guestSlug === "tamu-spesial";

  return (
    <div className="w-full rounded-3xl bg-white/70 border-2 border-white py-6 overflow-hidden shadow-card backdrop-blur">
      <div className="flex flex-col gap-2 px-6">
        <p className="text-base font-cormorant text-sand-700">Guestbook</p>
        <h3 className="text-2xl font-display text-ink-900">
          {isGenericGuest
            ? "Ucapan & Doa Restu"
            : "Kirim ucapan untuk Siska & Setio"}
        </h3>
        <p className="text-sm text-ink-500">
          {isGenericGuest
            ? "Kehangatan doa dari para kerabat untuk kedua mempelai."
            : "Satu tamu satu pesan. Kamu bisa edit ucapan kapan saja."}
        </p>
      </div>

      {!isGenericGuest && (
        <>
          {entry && !isEditing ? (
            <div
              ref={successRef}
              className="mt-6 mx-6 rounded-2xl border-2 border-white bg-sand-50 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-ink-900">
                    {entry.name}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-ink-500">
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
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-4 px-6"
            >
              <div className="grid gap-3">
                <label className="text-sm font-semibold text-ink-700">
                  Nama
                </label>
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
                <label className="text-sm font-semibold text-ink-700">
                  Ucapan
                </label>
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
        </>
      )}

      <div className="mt-12 w-full overflow-hidden">
        <p className="mb-6 px-6 text-base font-cormorant text-sand-700">
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
          <div className="flex flex-col gap-6">
            <div className="relative flex w-full overflow-hidden">
              <div
                ref={marqueeRef}
                className="flex w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing [scroll-behavior:auto]"
                onMouseEnter={() => {
                  isHovered.current = true;
                }}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={() => {
                  isHovered.current = true;
                  isDragging.current = true;
                }}
                onTouchEnd={() => {
                  isHovered.current = false;
                  isDragging.current = false;
                }}
              >
                <div className="flex w-max shrink-0 items-start gap-4 px-4 pb-4 pt-1">
                  {/* Grup A (Original) */}
                  {recentMessages.map((item, idx) => (
                    <div
                      key={`a-${item.guestSlug}`}
                      ref={idx === 0 ? firstItemRef : undefined}
                      className="w-[320px] shrink-0 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm whitespace-normal transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <p className="text-base font-semibold text-ink-900 font-display">
                        {item.name}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-ink-500 line-clamp-5">
                        {`"${item.message}"`}
                      </p>
                      {item.updatedAt && (
                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-sand-500">
                          {new Date(item.updatedAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Grup B (Clone) */}
                  {recentMessages.map((item, idx) => (
                    <div
                      key={`b-${item.guestSlug}`}
                      ref={idx === 0 ? midItemRef : undefined}
                      className="w-[320px] shrink-0 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm whitespace-normal transition hover:-translate-y-1 hover:shadow-md"
                      aria-hidden="true"
                    >
                      <p className="text-base font-semibold text-ink-900 font-display">
                        {item.name}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-ink-500 line-clamp-5">
                        {`"${item.message}"`}
                      </p>
                      {item.updatedAt && (
                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-sand-500">
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
            </div>
            <div className="flex justify-center px-6 transition-all duration-300">
              {!showAllMessages ? (
                <button
                  type="button"
                  onClick={() => setShowAllMessages(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:-translate-y-0.5"
                >
                  Lihat Semua Ucapan ({otherMessages.length})
                </button>
              ) : (
                <div className="w-full flex flex-col pt-4">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-6">
                    <h3 className="font-display text-xl font-semibold text-ink-900">
                      Semua Ucapan Tamu
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAllMessages(false)}
                      className="inline-flex items-center gap-2 rounded-full p-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500 transition hover:bg-sand-100/50 hover:text-ink-900"
                    >
                      Tutup <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 w-full">
                    {paginatedMessages.map((item) => (
                      <div
                        key={item.guestSlug}
                        className="rounded-3xl border border-sand-200 bg-white/60 p-6 shadow-sm text-left"
                      >
                        <p className="font-display text-base font-semibold text-ink-900">
                          {item.name}
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-ink-500">
                          {`"${item.message}"`}
                        </p>
                        {item.updatedAt && (
                          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-sand-500">
                            {new Date(item.updatedAt).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-sand-200">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft className="h-4 w-4 shrink-0" />
                        Sebelumnya
                      </button>
                      <span className="text-xs font-semibold text-sand-500">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
              )}
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
