"use client";

import Image from "next/image";
import { memo, useMemo } from "react";

import { GALLERY_PHOTOS } from "@/lib/gallery";

type GalleryGridProps = {
  photos?: typeof GALLERY_PHOTOS;
  onOpen: (index: number) => void;
};

function GalleryGridComponent({
  photos = GALLERY_PHOTOS,
  onOpen,
}: GalleryGridProps) {
  const rendered = useMemo(() => photos.slice(0, 6), [photos]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rendered.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onOpen(index)}
          className="group relative overflow-hidden rounded-3xl border border-sand-200 bg-sand-50"
        >
          <div
            className="relative w-full"
            style={{
              aspectRatio: photo.orientation === "portrait" ? "3 / 4" : "4 / 3",
            }}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              priority={index < 2}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="absolute bottom-4 left-4 right-4 text-left text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="text-base font-semibold">{photo.title}</p>
            <p className="text-xs text-white/70">{photo.subcaption}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default memo(GalleryGridComponent);
