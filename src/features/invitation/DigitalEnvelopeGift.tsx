"use client";

import { useState } from "react";
import { Copy, MapPin } from "lucide-react";

import { GIFT_ACCOUNTS, PHYSICAL_GIFT_ADDRESS } from "@/lib/gifts";

export default function DigitalEnvelopeGift() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section data-scroll-section>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-700">
            Amplop Digital
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink-900">
            Hadiah berupa doa adalah yang utama, namun jika memberi adalah
            ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless
            atau mengirimkannya ke alamat kami.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {GIFT_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="rounded-[30px] border border-sand-100 bg-white/90 p-6 shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
                {account.owner === "siska" ? "Rekening Siska" : "Rekening Tio"}
              </p>
              <p className="mt-3 text-sm font-semibold text-ink-700">
                {account.bank === "Dana" ? "E-wallet" : "Bank"} {account.bank}
              </p>
              <p className="mt-1 text-2xl font-semibold text-ink-900">
                {account.accountNumber}
              </p>
              <p className="text-sm text-ink-500">a.n. {account.accountName}</p>
              <button
                type="button"
                onClick={() => handleCopy(account.id, account.accountNumber)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-sand-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:-translate-y-0.5 hover:shadow"
              >
                <Copy className="h-4 w-4" />
                {copiedId === account.id ? "Tersalin" : "Salin Nomor"}
              </button>
            </div>
          ))}
        </div>
        <div className="rounded-[30px] border border-sand-100 bg-white/90 p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-sand-700" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-700">
              Alamat Pengiriman Kado
            </p>
          </div>
          <p className="mt-3 text-sm font-semibold text-ink-700">
            Penerima: {PHYSICAL_GIFT_ADDRESS.recipientName}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-900">
            {PHYSICAL_GIFT_ADDRESS.addressLine1}
            <br />
            {PHYSICAL_GIFT_ADDRESS.addressLine2}
            <br />
            {PHYSICAL_GIFT_ADDRESS.provincePostal}
          </p>
          <button
            type="button"
            onClick={() =>
              handleCopy(
                PHYSICAL_GIFT_ADDRESS.id,
                PHYSICAL_GIFT_ADDRESS.fullText,
              )
            }
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-sand-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 transition hover:-translate-y-0.5 hover:shadow"
          >
            <Copy className="h-4 w-4" />
            {copiedId === PHYSICAL_GIFT_ADDRESS.id
              ? "Tersalin"
              : "Salin Alamat"}
          </button>
        </div>
      </div>
    </section>
  );
}
