"use client";

import Image from "next/image";

import { COUPLE } from "@/lib/couple";

export default function CoupleProfiles() {
  const profiles = [
    { id: "bride", ...COUPLE.bride },
    { id: "groom", ...COUPLE.groom },
  ];

  return (
    <section>
      <div className="flex flex-col items-start gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
          Profil Pasangan
        </p>
        <h2 className="font-display text-3xl text-ink-900">
          Dua hati yang dipertemukan dalam doa
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-ink-500">
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
            className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center"
            data-scroll-section
          >
            <div
              className={`relative w-full overflow-hidden rounded-[48px] border border-sand-100 bg-sand-50 shadow-card ${
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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
                {profile.nickname}
              </p>
              <h3 className="text-3xl font-semibold text-ink-900">
                {profile.fullName}
              </h3>
              <p className="text-sm font-medium text-ink-500">
                {profile.parents}
              </p>
              <p className="text-sm leading-7 text-ink-500">{profile.intro}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
