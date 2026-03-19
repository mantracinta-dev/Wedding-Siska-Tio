export type GiftAccount = {
  id: string;
  owner: "siska" | "tio";
  bank: string;
  accountNumber: string;
  accountName: string;
};

export const GIFT_ACCOUNTS: GiftAccount[] = [
  {
    id: "siska-bsi",
    owner: "siska",
    bank: "BSI",
    accountNumber: "7187625607",
    accountName: "Siska Mulyaningsih",
  },
  {
    id: "siska-dana",
    owner: "siska",
    bank: "Dana",
    accountNumber: "089531718711",
    accountName: "Siska Mulyaningsih",
  },
];

export const PHYSICAL_GIFT_ADDRESS = {
  id: "physical-address",
  recipientName: "Siska & Tio (Toko Tommy Jaya)",
  addressLine1: "Lantai Dasar Pasar Plaza Pandeglang",
  addressLine2: "Kota Pandeglang, Kec. Pandeglang, Kab. Pandeglang",
  provincePostal: "Provinsi Banten 42213",
  fullText:
    "Toko Tommy Jaya, Lantai Dasar Pasar Plaza Pandeglang, Kota Pandeglang, Kec. Pandeglang, Kab. Pandeglang, Provinsi Banten 42213",
};
