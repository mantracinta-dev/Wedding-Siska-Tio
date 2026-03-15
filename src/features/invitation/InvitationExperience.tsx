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
import HeroSlideshow from "@/features/invitation/HeroSlideshow";
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
import InteractiveButterfly from "@/features/invitation/InteractiveButterfly";

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
    scrollToHero,
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
              <InteractiveButterfly
                className="w-20 h-20 top-0 bottom-0"
                baseRotate={-45}
                isOpened={isOpened}
                delay={0.15}
              />
              <InteractiveButterfly
                className="w-20 h-20 top-0 left-0"
                baseRotate={45}
                isOpened={isOpened}
                delay={0.3}
              />
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
                {isOpened ? (
                  <>
                    Kami mengundangmu untuk hadir dalam momen paling hangat
                    dalam hidup kami. Sentuhanmu di hari istimewa akan
                    melengkapi cerita cinta ini.
                    <br />
                    Scroll down untuk melihat detail acara
                  </>
                ) : (
                  "Kami mengundangmu untuk menjadi bagian dari hari bahagia kami. Klik untuk membuka amplop dan temukan detail lengkap acara."
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={isOpened ? scrollToHero : handleOpen}
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
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sand-200 shadow-inner">
                  <Image
                    src="/other/forever.webp"
                    alt="wedding"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority
                  />
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
                    {EVENT_DETAILS.ceremony.dateLabel}
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
          <div className="space-y-16" data-scroll-container id="hero-section">
            <section data-scroll-section>
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <HeroSlideshow />
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
                      Assalamu'alaikum Warahmatullahi Wabarakatuh.
                    </p>
                    <h2 className="mt-4 font-display text-4xl text-ink-900">
                      Merayakan perjalanan cinta yang hangat dan penuh doa
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-ink-500">
                      Dengan penuh rasa syukur, kami mengundangmu untuk
                      merayakan hari istimewa kami. Hadirnya kamu menjadi bagian
                      dari kenangan terindah dalam hidup kami.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-card">
                    <p className="text-2xl text-center font-semibold text-ink-900">
                      {EVENT_DETAILS.ceremony.dateLabel}
                    </p>
                    <CountdownTicker countdown={countdown} />
                  </div>
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
                      className="rounded-3xl border border-sand-200 bg-white/80 p-10 shadow-card"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
                        {event.title}
                      </p>
                      <p className="mt-4 text-xl font-semibold text-ink-900">
                        {event.dateLabel}
                      </p>
                      <p className="mt-2 text-sm text-ink-500 mb-10">
                        {event.time}
                      </p>
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
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-sand-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300 transition hover:-translate-y-0.5 bg-red-500 hover:text-white hover:shadow"
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
                  <p className="mt-4 text-sm leading-7 text-ink-500">
                    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                    menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
                    agar kamu cenderung dan merasa tenteram kepadanya, dan Dia
                    menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada
                    yang demikian itu benar-benar terdapat tanda-tanda
                    (kebesaran Allah) bagi kaum yang berpikir. ~ Ar Ruum;21"
                  </p>
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
                  "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                  Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan do'a restu
                  kepada kedua mempelai. "<br />
                  Wassalamu'alaikum Warahmatullahi Wabarakatuh.
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
                {activePhoto.subcaption}
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
