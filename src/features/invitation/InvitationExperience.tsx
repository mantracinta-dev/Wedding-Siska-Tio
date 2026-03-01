"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import Guestbook from "@/features/guestbook/Guestbook";
import CountdownTicker from "@/features/invitation/CountdownTicker";
import CoupleProfiles from "@/features/invitation/CoupleProfiles";
import DigitalEnvelopeGift from "@/features/invitation/DigitalEnvelopeGift";
import GalleryGrid from "@/features/invitation/GalleryGrid";
import { useInvitationViewModel } from "@/features/invitation/useInvitationViewModel";
import { AUDIO_TRACK, EVENT_DETAILS, MAP_URL } from "@/lib/event";
import type { GuestProfile } from "@/lib/guests";
import {
  CalendarDays,
  MapPin,
  Music2,
  Music4,
  X,
  ChevronsDown,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

gsap.registerPlugin(ScrollTrigger);

type InvitationExperienceProps = {
  guest: GuestProfile;
};

export default function InvitationExperience({
  guest,
}: InvitationExperienceProps) {
  const {
    guest: resolvedGuest,
    relationship,
    countdown,
    isOpened,
    hasInteracted,
    isAudioActive,
    isMusicMuted,
    audioError,
    activePhoto,
    containerRef,
    envelopeRef,
    handleOpen,
    toggleMusic,
    openLightbox,
    closeLightbox,
  } = useInvitationViewModel(guest);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const originalOverflow = useRef<string | null>(null);
  const originalHeight = useRef<string | null>(null);
  const handleMusicControl = () => {
    if (!isAudioActive) {
      handleOpen();
      return;
    }
    toggleMusic();
  };

  useLayoutEffect(() => {
    if (!isOpened || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { duration: 0.9, ease: "power3.out" },
      });
      if (envelopeRef.current) {
        timeline.to(envelopeRef.current, {
          rotateX: -120,
          y: -60,
          opacity: 0,
          transformOrigin: "top center",
        });
      }

      if (letterRef.current) {
        timeline.fromTo(
          letterRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.3",
        );
      }

      const heroTargets = gsap.utils.toArray<HTMLElement>("[data-opening]");
      if (heroTargets.length) {
        timeline.from(
          heroTargets,
          {
            y: 30,
            opacity: 0,
            stagger: 0.12,
          },
          "-=0.2",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, envelopeRef, isOpened, letterRef]);

  useLayoutEffect(() => {
    if (!isOpened || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-scroll-section]");
      if (!sections.length) return;

      const show = (els: HTMLElement[] | HTMLElement) =>
        gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
        });
      const hide = (els: HTMLElement[] | HTMLElement) =>
        gsap.to(els, {
          autoAlpha: 0,
          y: 40,
          duration: 0.5,
          overwrite: true,
        });

      gsap.set(sections, { autoAlpha: 0, y: 40 });

      ScrollTrigger.batch(sections, {
        start: "top 80%",
        end: "bottom 15%",
        onEnter: (batch) => show(batch as HTMLElement[]),
        onEnterBack: (batch) => show(batch as HTMLElement[]),
        onLeave: (batch) => hide(batch as HTMLElement[]),
        onLeaveBack: (batch) => hide(batch as HTMLElement[]),
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 180);
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, isOpened]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (originalOverflow.current === null) {
      originalOverflow.current = body.style.overflow;
      originalHeight.current = body.style.height;
    }

    if (!isOpened) {
      body.style.overflow = "";
      body.style.height = "";
    } else {
      body.style.overflow = originalOverflow.current || "";
      body.style.height = originalHeight.current || "";
    }

    return () => {
      body.style.overflow = originalOverflow.current || "";
      body.style.height = originalHeight.current || "";
    };
  }, [isOpened]);

  useEffect(() => {
    if (!activePhoto) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePhoto, closeLightbox]);

  const musicLabel = !isAudioActive
    ? "Play Music"
    : isMusicMuted
      ? "Unmute Music"
      : "Mute Music";
  const musicActive = isAudioActive && !isMusicMuted;

  return (
    <>
      <main ref={containerRef} className="min-h-screen text-ink-900 bg-pattern">
        <section
          className={
            isOpened
              ? "pt-16 pb-12"
              : "flex min-h-screen items-center justify-center px-6"
          }
          data-opening
        >
          <div
            className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-card backdrop-blur"
            data-opening
          >
            <div
              className="flex flex-col items-center gap-6 text-center"
              data-opening
            >
              <div className="w-20 h-20 absolute top-0 right-0 -rotate-45">
                <DotLottieReact
                  src="/lottie/Butterfly.lottie"
                  loop
                  autoplay
                  width="120px"
                  height="120px"
                />
              </div>
              <div className="w-20 h-20 absolute top-0 left-0 rotate-45">
                <DotLottieReact
                  src="/lottie/Butterfly.lottie"
                  loop
                  autoplay
                  width="120px"
                  height="120px"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sand-700">
                Undangan Pernikahan
              </p>
              <h1 className="font-display text-4xl text-ink-900 sm:text-5xl">
                Siska & Tio
              </h1>
              <div className="text-sm text-ink-500">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">
                  Kepada Yth
                </p>
                <p className="mt-2 text-lg font-semibold text-ink-900">
                  {resolvedGuest.name} {relationship}
                </p>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink-500">
                {isOpened
                  ? "Kami mengundangmu untuk hadir dalam momen paling hangat dalam hidup kami. Sentuhanmu di hari istimewa akan melengkapi cerita cinta ini. Scroll down untuk melihat detail acara"
                  : "Kami mengundangmu untuk menjadi bagian dari hari bahagia kami. Klik untuk membuka amplop dan temukan detail lengkap acara."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="cursor-pointer rounded-full bg-ink-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:shadow"
                >
                  {isOpened ? (
                    <div className="flex items-center gap-2">
                      Lihat Detail Acara
                      <ChevronsDown className="w-4 h-4" />
                    </div>
                  ) : hasInteracted ? (
                    "Membuka..."
                  ) : (
                    "Buka Undangan"
                  )}
                </button>
              </div>
              {!isOpened && (
                <p className="text-xs uppercase tracking-[0.3em] text-ink-400 flex gap-1">
                  <Music4 className="w-4 h-4" /> {AUDIO_TRACK.title} ·{" "}
                  {AUDIO_TRACK.composer}
                </p>
              )}

              {audioError && (
                <p className="text-xs text-rose-600">{audioError}</p>
              )}
            </div>

            {!isOpened && (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <button
                    type="button"
                    ref={envelopeRef}
                    onClick={handleOpen}
                    className="relative cursor-pointer flex aspect-[4/3] w-full items-center justify-center rounded-3xl border border-sand-200 bg-gradient-to-br from-sand-50 via-white to-sand-100 shadow-inner"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sand-100 via-sand-50 to-white" />
                    <div
                      className="absolute left-6 right-6 top-6 h-1/2 rounded-t-[26px] bg-gradient-to-b from-sand-200 via-sand-100 to-sand-50"
                      style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                    />
                    <div className="absolute inset-6 rounded-[28px] border border-sand-200" />
                    <div className="relative text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
                        Amplop Tertutup
                      </p>
                      <p className="mt-2 text-sm text-ink-500">
                        Tap untuk membuka undangan
                      </p>
                    </div>
                  </button>
                  <div
                    ref={letterRef}
                    className="pointer-events-none absolute inset-0 flex translate-y-8 flex-col rounded-[30px] border border-sand-100 bg-white/95 px-8 py-10 text-left opacity-0 shadow-card"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-600">
                      Dear
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-ink-900">
                      {resolvedGuest.name}
                    </p>
                    <p className="mt-6 text-sm leading-7 text-ink-500">
                      Kami mengundangmu untuk hadir dalam momen paling hangat
                      dalam hidup kami. Sentuhanmu di hari istimewa akan
                      melengkapi cerita cinta ini.
                    </p>
                  </div>
                </div>
                <div
                  className="flex flex-col justify-center rounded-3xl border border-sand-200 bg-white/80 p-6"
                  data-opening
                >
                  <div className="flex items-center gap-3 text-ink-700">
                    <CalendarDays className="h-5 w-5" />
                    <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                      Save the Date
                    </p>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-ink-900">
                    Sabtu, 18 Juli 2026
                  </p>
                  <p className="mt-2 text-sm text-ink-500">
                    Pandeglang — Satu hari penuh kebahagiaan
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {isOpened && (
          <div className="space-y-16" data-scroll-container>
            <section data-scroll-section>
              <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
                    Hero
                  </p>
                  <h2 className="mt-4 font-display text-4xl text-ink-900">
                    Merayakan perjalanan cinta yang hangat dan penuh doa
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-ink-500">
                    Dengan penuh rasa syukur, kami mengundangmu untuk merayakan
                    hari istimewa kami. Hadirnya kamu menjadi bagian dari
                    kenangan terindah dalam hidup kami.
                  </p>
                </div>
                <div className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
                    Countdown
                  </p>
                  <CountdownTicker countdown={countdown} />
                </div>
              </div>
            </section>

            <CoupleProfiles />

            <section data-scroll-section>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
                    Detail Acara
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-ink-900">
                    Dua momen berharga dalam satu hari bahagia
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {Object.values(EVENT_DETAILS).map((event) => (
                    <div
                      key={event.title}
                      className="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-card"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
                        {event.title}
                      </p>
                      <p className="mt-4 text-xl font-semibold text-ink-900">
                        {event.dateLabel}
                      </p>
                      <p className="mt-2 text-sm text-ink-500">{event.time}</p>
                      <p className="mt-4 text-sm font-semibold text-ink-700">
                        {event.location}
                      </p>
                      <p className="mt-2 text-sm text-ink-500">
                        {event.address}
                      </p>
                    </div>
                  ))}
                </div>
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-sand-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:-translate-y-0.5 hover:shadow"
                >
                  <MapPin className="h-4 w-4" />
                  Buka Google Maps
                </a>
              </div>
            </section>

            <section data-scroll-section>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
                    Gallery
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-ink-900">
                    Momen-momen yang memeluk kisah kami
                  </h2>
                </div>
                <GalleryGrid onOpen={openLightbox} />
              </div>
            </section>

            <DigitalEnvelopeGift />

            <section data-scroll-section>
              <Guestbook
                guestSlug={resolvedGuest.slug}
                guestName={resolvedGuest.name}
              />
            </section>

            <section className="pb-20" data-scroll-section>
              <div className="rounded-3xl border border-sand-200 bg-white/80 p-8 text-center shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
                  Terima Kasih
                </p>
                <h2 className="mt-4 font-display text-3xl text-ink-900">
                  Kehadiranmu adalah doa terindah
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink-500">
                  Dengan penuh cinta, kami berharap dapat merayakan momen ini
                  bersama kamu. Sampai jumpa di hari bahagia kami.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 px-4 py-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink-900 shadow"
              aria-label="Tutup foto"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 60vw, 90vw"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                {activePhoto.location}
              </p>
              <p className="text-2xl font-semibold">{activePhoto.title}</p>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={handleMusicControl}
        aria-pressed={musicActive}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-40 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 shadow-card backdrop-blur transition hover:-translate-y-0.5"
      >
        <Music2
          className={`h-4 w-4 ${musicActive ? "text-sand-700" : "text-ink-300"}`}
        />
        {musicLabel}
      </button>
    </>
  );
}
