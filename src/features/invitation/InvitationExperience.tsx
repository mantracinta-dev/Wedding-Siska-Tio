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
  CalendarPlus,
  MapPin,
  Music4,
  Volume2,
  VolumeOff,
  X,
  ChevronsDown,
} from "lucide-react";

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

      gsap.set(sections, { autoAlpha: 0, y: 40 });

      ScrollTrigger.batch(sections, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => show(batch as HTMLElement[]),
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

  const musicActive = isAudioActive && !isMusicMuted;

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Pernikahan Siska & Setio",
  )}&dates=20260502T020000Z/20260502T080000Z&details=${encodeURIComponent(
    "Kehadiranmu adalah doa terindah untuk kami.",
  )}&location=${encodeURIComponent(EVENT_DETAILS.ceremony.address)}`;

  return (
    <>
      <main
        ref={containerRef}
        className="min-h-screen w-full overflow-x-hidden text-ink-900 bg-pattern"
      >
        <section
          className={
            isOpened
              ? "pt-16 pb-12"
              : "flex min-h-screen items-center justify-center px-6"
          }
          data-opening
        >
          <div
            className="relative rounded-[32px] border-2 border-white bg-white/70 p-8 shadow-card backdrop-blur bg-card"
            data-opening
          >
            <div
              className="flex flex-col items-center gap-6 text-center"
              data-opening
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sand-700">
                Undangan Pernikahan
              </p>
              <h1 className="font-name-style text-4xl text-ink-900 sm:text-5xl">
                Siska & Setio
              </h1>
              <div className="text-sm text-ink-500">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">
                  Kepada Yth
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">
                  {resolvedGuest.name} {relationship}
                </p>
              </div>
              <p className="max-w-xl sm:text-base text-xs  leading-relaxed text-ink-500">
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
            </div>

            {!isOpened && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-2 border-white shadow-inner">
                  <Image
                    src="/other/together-opt.jpg"
                    alt="wedding"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority
                  />
                </div>
                <div
                  className="flex flex-col justify-center rounded-3xl border-2 border-white shadow bg-white/80 p-6"
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
                    Pandeglang, Banten
                  </p>
                </div>
                {!isOpened && (
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-400 flex justify-center gap-1">
                    <Music4 className="w-4 h-4 mr-2" /> {AUDIO_TRACK.title} ·{" "}
                    {AUDIO_TRACK.composer}
                  </p>
                )}

                {audioError && (
                  <p className="text-xs text-rose-600">{audioError}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {isOpened && (
          <div className="space-y-16" data-scroll-container id="hero-section">
            <section data-scroll-section>
              <div className="text-center py-3 mb-12 text-sand-700">
                <div className="">
                  <p className="font-niconne text-3xl md:text-4xl tracking-normal normal-case">
                    Assalamu&apos;alaikum Warahmatullahi Wabarakatuh.
                  </p>
                  <p className="mt-4 text-sm md:text-lg leading-relaxed text-white">
                    &quot;Maha suci Allah yang telah menciptakan mahluk-Nya
                    berpasang-pasangan. Ya Allah, perkenankanlah kami
                    merangkaikan kasih sayang yang Kau ciptakan diantara kami
                    untuk mengikuti Sunnah Rasul-Mu dalam rangka membentuk
                    keluarga yang sakinah, mawaddah, warahmah.&quot;
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <HeroSlideshow />
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="mt-4 font-display text-4xl text-sand-500">
                      Merayakan perjalanan cinta yang hangat dan penuh doa
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white">
                      Dengan penuh rasa syukur, kami mengundangmu untuk
                      merayakan hari istimewa kami. Hadirnya kamu menjadi bagian
                      dari kenangan terindah dalam hidup kami.
                    </p>
                  </div>
                  <div className="rounded-3xl border-2 border-white bg-white/70 p-6 shadow-card bg-card">
                    <p className="text-4xl text-center font-niconne text-ink-900">
                      {EVENT_DETAILS.ceremony.dateLabel}
                    </p>
                    <CountdownTicker countdown={countdown} />
                    <div className="mt-6 flex justify-center">
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-black shadow bg-stone-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:-translate-y-0.5 hover:shadow cursor-pointer"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Simpan di Kalender
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <CoupleProfiles />

            <section data-scroll-section>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-base font-cormorant text-sand-700">
                    Detail Acara
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-sand-500">
                    Dua momen berharga dalam satu hari bahagia
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.values(EVENT_DETAILS).map((event) => (
                    <div
                      key={event.title}
                      className="relative flex h-full flex-col justify-center rounded-[2rem] border-2 border-white bg-card-detail p-10 text-center shadow-card"
                    >
                      {/* Bunga Sudut Kiri Atas */}
                      {/* <div className="absolute -left-1 -top-3 h-32 w-32 pointer-events-none z-0 md:h-44 md:w-44">
                        <Image
                          src="/other/flower-corner.png"
                          alt="Flower Ornament Left"
                          fill
                          className="object-contain object-left-top"
                        />
                      </div> */}

                      {/* Bunga Sudut Kanan Bawah */}
                      {/* <div className="absolute -bottom-3 -right-1 h-32 w-32 rotate-180 pointer-events-none z-0 md:h-44 md:w-44">
                        <Image
                          src="/other/flower-corner.png"
                          alt="Flower Ornament Right"
                          fill
                          className="object-contain object-left-top"
                        />
                      </div> */}

                      <div className="relative z-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
                          {event.title}
                        </p>
                        <p className="mt-4 text-2xl font-display text-ink-900 md:text-3xl">
                          {event.dateLabel}
                        </p>
                        <p className="mt-2 text-base sm:text-xl text-ink-500 mb-8">
                          {event.time}
                        </p>
                        <p className="mt-20 text-sm sm:text-xl font-bold uppercase text-ink-900">
                          {event.location}
                        </p>
                        <p className="mt-2 text-sm text-ink-500 leading-relaxed max-w-[250px] mx-auto">
                          {event.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <a
                    href={MAP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="relative inline-flex w-fit items-center gap-2 rounded-full border border-sand-200 px-5 py-3 text-white text-xs font-bold uppercase tracking-[0.2em] transition hover:-translate-y-0.5 bg-black hover:text-white hover:shadow group"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80"></span>
                      <MapPin className="relative h-4 w-4 group-hover:animate-none" />
                    </div>
                    Kunjungi Lokasi
                  </a>
                </div>
              </div>
            </section>

            <section data-scroll-section>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-base font-cormorant text-sand-700">
                    Gallery
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-sand-500">
                    Momen-momen yang memeluk kisah kami
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white">
                    &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                    menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
                    agar kamu cenderung dan merasa tenteram kepadanya, dan Dia
                    menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada
                    yang demikian itu benar-benar terdapat tanda-tanda
                    (kebesaran Allah) bagi kaum yang berpikir. ~ Ar
                    Ruum;21&quot;
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
              <div className="rounded-3xl border-2 border-white bg-white/80 p-8 text-center shadow-card bg-card">
                <p className="text-2xl font-cormorant text-sand-700">
                  Terima Kasih
                </p>
                <h2 className="mt-4 font-display text-3xl text-ink-900">
                  Kehadiranmu adalah doa terindah
                </h2>
                <p className="mt-4 text-xs sm:text-base leading-relaxed text-ink-500">
                  &quot;Merupakan suatu kehormatan dan kebahagiaan bagi kami
                  apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan
                  do&apos;a restu kepada kedua mempelai.&quot;
                </p>
                <p className="mt-5 font-niconne text-xl md:text-3xl text-sand-700">
                  Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 backdrop-blur-md px-4 py-10"
          style={{ animation: "fadeIn 0.4s ease-out forwards" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes zoomIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes breathingPan {
              0% { transform: scale(1) translate(0, 0); }
              50% { transform: scale(1.06) translate(1.5%, -1.5%); }
              100% { transform: scale(1.03) translate(-1%, 1%); }
            }
          `}</style>
          <div
            className={`relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl group ${
              activePhoto.orientation === "portrait"
                ? "max-w-[85vw] sm:max-w-md lg:max-w-lg"
                : "max-w-[95vw] md:max-w-4xl lg:max-w-5xl"
            }`}
            style={{ animation: "zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink-900 shadow transition hover:bg-white hover:scale-110"
              aria-label="Tutup foto"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="relative w-full"
              style={{
                aspectRatio:
                  activePhoto.orientation === "portrait" ? "3 / 4" : "4 / 3",
              }}
            >
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                className="object-cover"
                style={{ animation: "breathingPan 25s ease-in-out infinite alternate" }}
                sizes="(min-width: 1024px) 80vw, (min-width: 768px) 90vw, 100vw"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80 md:text-base">
                {activePhoto.subcaption}
              </p>
              <p className="text-2xl font-semibold md:text-4xl">{activePhoto.title}</p>
            </div>
          </div>
        </div>
      )}
      <div
        hidden={!isOpened}
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-40 flex flex-col gap-3"
      >
        <div className="relative flex">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sand-400 opacity-60"></span>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Buka Google Maps"
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-xl border border-sand-200 backdrop-blur transition hover:-translate-y-0.5"
          >
            <MapPin className="h-5 w-5 text-sand-700" />
          </a>
        </div>
        <button
          type="button"
          onClick={handleMusicControl}
          aria-pressed={musicActive}
          aria-label="Toggle musik"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-xl border border-sand-200 backdrop-blur transition hover:-translate-y-0.5"
        >
          {musicActive ? (
            <Volume2 className="h-5 w-5 text-sand-700" />
          ) : (
            <VolumeOff className="h-5 w-5 text-ink-300" />
          )}
        </button>
      </div>
    </>
  );
}
