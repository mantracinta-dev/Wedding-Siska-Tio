"use client";

import { useEffect, useRef, useState } from "react";

import { useCountdown } from "@/features/invitation/useCountdown";
import { AUDIO_TRACK, EVENT_DATE_ISO } from "@/lib/event";
import { GALLERY_PHOTOS } from "@/lib/gallery";
import type { GuestProfile } from "@/lib/guests";

export function useInvitationViewModel(guest: GuestProfile) {
  const countdown = useCountdown(EVENT_DATE_ISO);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const envelopeRef = useRef<HTMLButtonElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isOpened, setIsOpened] = useState(guest.skipCover ?? false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const activePhoto =
    activePhotoIndex === null ? null : GALLERY_PHOTOS[activePhotoIndex];

  const ensureAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_TRACK.src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.65;
      audio.muted = isMusicMuted;
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const playAudio = async () => {
    try {
      const audio = ensureAudio();
      audio.muted = false;
      audio.volume = 0.65;
      await audio.play();
      setAudioError(null);
      setIsAudioActive(true);
      setIsMusicMuted(false);
    } catch {
      setAudioError("Audio perlu izin manual");
      setIsMusicMuted(true);
      setIsAudioActive(false);
    }
  };

  const handleOpen = () => {
    if (isOpened) return;
    setHasInteracted(true);
    setIsOpened(true);
    playAudio();
  };

  const scrollToHero = () => {
    document
      .getElementById("hero-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMusic = () => {
    if (!hasInteracted) {
      handleOpen();
      return;
    }

    if (!isAudioActive) {
      playAudio();
      return;
    }

    const audio = ensureAudio();
    if (isMusicMuted) {
      audio.muted = false;
      setIsMusicMuted(false);
    } else {
      audio.muted = true;
      setIsMusicMuted(true);
    }
  };

  const openLightbox = (index: number) => setActivePhotoIndex(index);
  const closeLightbox = () => setActivePhotoIndex(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return {
    guest,
    relationship: guest.relationship ? `(${guest.relationship})` : "",
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
  };
}
