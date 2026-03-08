"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GALLERY_PHOTOS } from "@/lib/gallery";

const slides = [
  ...GALLERY_PHOTOS.filter((photo) => photo.orientation === "portrait").map(
    (photo) => photo.src,
  ),
]; // showing all portrait galllery photos

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // Ganti gambar setiap 4 detik
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl shadow-card border border-sand-200">
      {slides.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      ))}
    </div>
  );
}
