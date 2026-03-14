"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface InteractiveButterflyProps {
  className?: string;
  isOpened: boolean;
  baseRotate?: number;
  delay?: number;
}

export default function InteractiveButterfly({
  className = "",
  isOpened,
  baseRotate = 0,
  delay = 0,
}: InteractiveButterflyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(0.8);

  // Set rotasi awal menggunakan GSAP saat pertama kali mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { rotation: baseRotate });
    }
  }, [baseRotate]);

  // Efek Elegan: Terbang Menghilang Saat Undangan Dibuka
  useEffect(() => {
    if (!isOpened || !containerRef.current) return;

    // Panik & Kepak Sayap Lebih Cepat
    setSpeed(2.5);

    // Bikin variasi arah terbang (ke kiri atas atau kanan atas)
    const isLeftButterfly = baseRotate > 0; // Sudut positif ada di kiri

    const flyPathX = isLeftButterfly
      ? -150 - Math.random() * 100
      : 150 + Math.random() * 100;
    const flyPathY = -400 - Math.random() * 200; // Melambung tinggi ke atas

    const tl = gsap.timeline({
      delay: delay, // Variasi waktu berangkat antara kupu-kupu kiri dan kanan
      onComplete: () => {
        // Hapus elemen selamanya jika animasinya sudah kelar
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
      },
    });

    // 1. Kaget / Takeoff: memiringkan badannya menghadap rute lalu terbang
    tl.to(containerRef.current, {
      rotation: isLeftButterfly ? -30 : 30, // Menghadap ke atas / lajur pelarian
      duration: 0.4,
      ease: "power2.out",
    })
      // 2. Berlari ke angkasa sambil perlahan transparan
      .to(
        containerRef.current,
        {
          x: flyPathX,
          y: flyPathY,
          rotation: isLeftButterfly ? -60 : 60, // Semakin miring ke luar layer
          scale: 0.5,
          opacity: 0,
          duration: 2 + Math.random(),
          ease: "power1.inOut",
        },
        "-=0.2",
      ); // Overlap dengan durasi takeoff

    return () => {
      tl.kill();
    };
  }, [isOpened, delay, baseRotate]);

  return (
    <div
      ref={containerRef}
      className={`absolute z-10 pointer-events-none ${className}`}
      style={{ padding: "10px", marginTop: "-10px" }}
    >
      <div style={{ width: "120px", height: "120px" }}>
        <DotLottieReact
          src="/lottie/Butterfly.lottie"
          loop
          autoplay
          speed={speed}
        />
      </div>
    </div>
  );
}
