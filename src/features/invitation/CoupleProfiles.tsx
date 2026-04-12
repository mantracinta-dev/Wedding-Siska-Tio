"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { COUPLE } from "@/lib/couple";

export default function CoupleProfiles() {
  const profiles = [
    { id: "bride", ...COUPLE.bride },
    { id: "groom", ...COUPLE.groom },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      articleRefs.current.forEach((article, index) => {
        if (!article) return;

        // Perempuan (index 0) dari kanan (x: 100), Laki-laki (index 1) dari kiri (x: -100)
        const xOffset = index === 0 ? 100 : -100;

        gsap.fromTo(
          article,
          {
            opacity: 0,
            x: xOffset,
          },
          {
            scrollTrigger: {
              trigger: article,
              start: "top 85%",
              once: true,
            },
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="flex flex-col items-start gap-6">
        <p className="text-base font-cormorant text-sand-700">
          Profil Pasangan
        </p>
        <h2 className="font-display text-3xl text-sand-500">
          Dua hati yang dipertemukan dalam doa
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-white">
          Maha suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan.
          Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau
          ciptakan diantara kami untuk mengikuti Sunnah Rasul-Mu dalam rangka
          membentuk keluarga yang sakinah, mawaddah, warahmah.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {profiles.map((profile, index) => (
          <article
            key={profile.id}
            ref={(el) => {
              articleRefs.current[index] = el;
            }}
            className="opacity-0 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center"
          >
            <div
              className={`relative w-full overflow-hidden rounded-[18px] border-2 border-white bg-sand-50 shadow-card ${
                index % 2 === 1 ? "md:order-2" : ""
              }`}
              style={{ aspectRatio: "4 / 5" }}
            >
              <Image
                src={profile.photo}
                alt={profile.fullName}
                fill
                sizes="(min-width:1024px) 520px, 92vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
            <div
              className={`flex flex-col gap-3 ${
                index % 2 === 1 ? "md:order-1 md:items-end md:text-right" : ""
              }`}
            >
              <p className="text-xl font-serif-display text-sand-700 tracking-widest">
                {profile.nickname}
              </p>
              <h3 className="text-4xl font-name-style text-sand-500">
                {profile.fullName}
              </h3>
              <p className="text-base font-medium text-white">
                {profile.parents}
              </p>
              <p className="text-base leading-relaxed text-ink-500">
                {profile.intro}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
