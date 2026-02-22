import InvitationExperience from "@/features/invitation/InvitationExperience";
import { resolveGuest } from "@/lib/guests";
import { notFound } from "next/navigation"; // Opsional: untuk handle tamu tak dikenal

type InvitePageProps = {
  // 1. Ubah params menjadi Promise
  params: Promise<{ guestSlug: string }>;
};

// 2. Tambahkan 'async' di depan function
export default async function InvitePage({ params }: InvitePageProps) {
  // 3. 'await' params sebelum mengambil guestSlug
  const { guestSlug } = await params;

  // Ambil data tamu berdasarkan slug
  const guest = resolveGuest(guestSlug);

  // Tips: Jika tamu tidak ditemukan, arahkan ke halaman 404 atau halaman umum
  if (!guest) {
    notFound();
  }

  return <InvitationExperience guest={guest} />;
}
