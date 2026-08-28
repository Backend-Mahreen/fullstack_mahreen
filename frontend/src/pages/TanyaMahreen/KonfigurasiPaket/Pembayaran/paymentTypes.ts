export type PaymentMethodId =
  | "bank-transfer"
  | "virtual-account"
  | "e-wallet";

export type BankId = "bca" | "bni" | "bri" | "mandiri";
export type WalletId = "qris" | "gopay" | "ovo";

export type BillingInformationValue = {
  fullName: string;
  companyName: string;
  invoiceAddress: string;
};

export type PaymentDetailsValue = {
  bankTransferBank: BankId;
  virtualAccountBank: BankId;
  wallet: WalletId;
};

export type PackageTierSnapshot = {
  id?: string;
  tier?: string;
  name: string;
  price: number;
  priceNote?: string;
};

export type AddOnSnapshot = {
  id?: string;
  title: string;
  priceValue: number;
};

export type WebsitePackageSelection = {
  serviceKey?: string;
  category?: string;
  sourceRoute?: string;
  tier: PackageTierSnapshot;
  addOns: AddOnSnapshot[];
  total: number;
  updatedAt?: string;
};

export type ServicePaymentStatus = "pending" | "paid";

export type ServicePaymentDraft = {
  selection: WebsitePackageSelection;
  billingInformation: BillingInformationValue;
  selectedMethod: PaymentMethodId;
  paymentDetails: PaymentDetailsValue;
  total: number;
  transactionId: string;
  status: ServicePaymentStatus;
  updatedAt: string;
};
