export type GuestProfile = {
  slug: string;
  name: string;
  relationship?: string;
  skipCover?: boolean;
};

const GUESTS: Record<string, GuestProfile> = {
  "sahabat-andi": {
    slug: "sahabat-andi",
    name: "Andi Wijaya",
    relationship: "Sahabat kampus",
  },
  "keluarga-nisa": {
    slug: "keluarga-nisa",
    name: "Keluarga Besar Nisa",
    relationship: "Keluarga Jakarta",
  },
  "tim-produk": {
    slug: "tim-produk",
    name: "Tim Produk Favorite",
    relationship: "Rekan kerja",
  },
};

const fallbackName = (raw: string | undefined) => {
  if (!raw) return "Tamu Spesial";
  return raw
    .replace(/[.-]/g, " ") // Ubah titik atau strip jadi spasi
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .trim();
};

export function resolveGuest(slugInput: string): GuestProfile {
  try {
    const normalized = decodeURIComponent(slugInput || "").toLowerCase();
    if (GUESTS[normalized]) return GUESTS[normalized];

    return {
      slug: normalized || "tamu-spesial",
      name: fallbackName(normalized),
      skipCover: normalized === "tamu",
    };
  } catch {
    return {
      slug: slugInput,
      name: fallbackName(slugInput),
      skipCover: slugInput.toLowerCase() === "tamu",
    };
  }
}
