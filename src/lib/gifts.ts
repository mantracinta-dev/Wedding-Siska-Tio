export type GiftAccount = {
  id: string;
  owner: "siska" | "tio";
  bank: string;
  accountNumber: string;
  accountName: string;
};

export const GIFT_ACCOUNTS: GiftAccount[] = [
  {
    id: "siska-bca",
    owner: "siska",
    bank: "BCA",
    accountNumber: "1234567890",
    accountName: "Siska Mulyaningsih",
  },
  {
    id: "tio-mandiri",
    owner: "tio",
    bank: "Mandiri",
    accountNumber: "9876543210",
    accountName: "Tio Abadi",
  },
];
