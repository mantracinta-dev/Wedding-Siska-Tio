# PRD v2.0 --- Wedding Invitation Website

## Cinematic Digital Experience

------------------------------------------------------------------------

## 1. Product Overview

Website undangan pernikahan berbasis web yang memberikan pengalaman
emosional seperti membuka undangan fisik, dengan animasi cinematic yang
smooth dan personalisasi berdasarkan nama tamu.

Target utama: - Pengalaman elegan - Ringan di mobile - Interaksi
sederhana - Tanpa login

------------------------------------------------------------------------

## 2. Product Goals

### Primary Goals

-   Memberikan pengalaman undangan digital yang premium
-   Animasi smooth tanpa lag di mobile
-   Personal invitation per tamu
-   Guestbook sederhana & stabil

### Non‑Goals

-   Tidak menjadi social platform
-   Tidak ada upload media tamu
-   Tidak ada AI feature
-   Tidak fokus SEO

------------------------------------------------------------------------

## 3. Target User

### Guest (Primary)

-   Membuka link dari WhatsApp
-   Device dominan: mobile

### Couple/Admin (Secondary)

-   Melihat ucapan yang masuk

------------------------------------------------------------------------

## 4. Core User Flow

Klik Link Personal\
→ Opening Envelope Animation\
→ Music Start (user interaction)\
→ Hero Section\
→ Countdown\
→ Event Detail + Map\
→ Gallery\
→ Guestbook (Kirim Ucapan)\
→ Closing Section

------------------------------------------------------------------------

## 5. Feature Scope (MVP)

### 5.1 Personal Invitation URL

Route:

    /invite/[guestSlug]

Menampilkan nama tamu otomatis tanpa autentikasi.

### 5.2 Opening Animation (GSAP)

-   Amplop tertutup
-   Klik → animasi membuka
-   Reveal konten bertahap
-   Music mulai setelah klik

### 5.3 Background Music

-   Tidak autoplay
-   Play setelah interaksi user
-   Tombol mute/play tersedia

### 5.4 Countdown Event

Menampilkan hari, jam, menit, detik secara realtime di client.

### 5.5 Event Detail

-   Tanggal & waktu
-   Lokasi acara
-   Tombol buka Google Maps

### 5.6 Photo Gallery

-   Responsive grid
-   Lazy loading
-   Lightbox preview

### 5.7 Guestbook (Ucapan)

Form: - Nama - Ucapan (maks 300 karakter)

Rules: - 1 tamu = 1 ucapan - Bisa edit - Tidak ada upload file

UX: - Submit → langsung tampil - Tombol edit tersedia

------------------------------------------------------------------------

## 6. Architecture

### Pattern: MVVM

  Layer              Responsibility
  ------------------ ---------------------------
  View               UI + GSAP animation
  ViewModel          State & interaction logic
  Model/Repository   Supabase access

### Project Structure

    src/
     ├ app/
     ├ features/
     │   ├ invitation/
     │   └ guestbook/
     ├ lib/
     │   ├ db.ts
     │   └ repository/
     └ app/api/

------------------------------------------------------------------------

## 7. Database Design (Supabase)

### Table: messages

``` sql
create table messages (
  guest_slug text primary key,
  name text not null,
  message text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

Karakteristik: - UPSERT only - Tidak bisa duplicate - Storage sangat
kecil

------------------------------------------------------------------------

## 8. API Behavior

### POST /api/message

-   Insert jika belum ada
-   Update jika sudah ada
-   Validasi panjang pesan
-   Trim text input

Response selalu sukses secara UX.

------------------------------------------------------------------------

## 9. Performance Requirements

Target mobile: - First interaction \< 2.5s - Animation FPS ≥ 55fps -
Initial JS ringan - Gallery lazy load - Audio load setelah opening

------------------------------------------------------------------------

## 10. GSAP Animation Guidelines (FREE VERSION)

Allowed: - GSAP core - Timeline - ScrollTrigger (free)

Rules: - Animate hanya transform & opacity - Duration 0.8--1.2s - Ease:
power3.out - Trigger once - Section-based animation

Forbidden: - Layout animation (width/height/top) - Heavy autoplay
animation

------------------------------------------------------------------------

## 11. Rendering Strategy

-   Static shell page
-   Client-side data fetch
-   Animation start after mount
-   No SEO optimization

------------------------------------------------------------------------

## 12. Security Rules

-   guestSlug sebagai identity
-   Server-side validation mandatory
-   Unique constraint database
-   Input sanitization

------------------------------------------------------------------------

## 13. Graceful Limit Handling

Jika database limit tercapai: - API tetap return success - Data disimpan
local sementara - User tidak melihat error

------------------------------------------------------------------------

## 14. Definition of Done (MVP)

-   Personal URL bekerja
-   Opening animation smooth
-   Music berjalan
-   Countdown akurat
-   Gallery responsive
-   Map terbuka
-   Ucapan bisa kirim & edit
-   Tidak ada double submit
-   Smooth di mobile

------------------------------------------------------------------------

## Product Principle

Fokus utama bukan fitur banyak, tetapi pengalaman emosional yang halus
dan ringan.
