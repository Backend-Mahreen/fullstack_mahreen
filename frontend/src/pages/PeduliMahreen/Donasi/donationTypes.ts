export type DonationPaymentMethodId =
  | "qris"
  | "shopeepay"
  | "bca-va"
  | "mandiri-va";

export type DonationDonorInformation = Readonly<{
  fullName: string;
  email: string;
  whatsapp: string;
  anonymous: boolean;
  message: string;
}>;

export type DonationDraft = Readonly<{
  campaignId: string;
  amount: number;
  donor: DonationDonorInformation;
  paymentMethod: DonationPaymentMethodId | null;
  transactionId: string;
  status: "draft" | "pending" | "paid";
  createdAt: string;
  updatedAt: string;
}>;

export type DonationPaymentMethod = Readonly<{
  id: DonationPaymentMethodId;
  label: string;
  description: string;
  group: "wallet" | "bank";
}>;
