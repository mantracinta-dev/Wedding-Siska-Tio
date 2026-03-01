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
