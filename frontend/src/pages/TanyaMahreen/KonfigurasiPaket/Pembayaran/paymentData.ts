import {
  PAYMENT_BRANDS,
  type PaymentBrandId,
} from "../../../../data/paymentBrands";
import type {
  BankId,
  PaymentDetailsValue,
  PaymentMethodId,
  WalletId,
} from "./paymentTypes";

export type BankOption = Readonly<{
  id: BankId;
  name: string;
  longName: string;
  logo: string;
  brand: PaymentBrandId;
  accountNumber: string;
  virtualAccountPrefix: string;
}>;

export type WalletOption = Readonly<{
  id: WalletId;
  name: string;
  brand: PaymentBrandId;
  logo: string;
}>;

export const BANK_OPTIONS: readonly BankOption[] = [
  {
    id: "bca",
    name: "BCA",
    longName: "Bank Central Asia",
    logo: PAYMENT_BRANDS.bca.image,
    brand: "bca",
    accountNumber: "123 456 7890",
    virtualAccountPrefix: "8808",
  },
  {
    id: "bni",
    name: "BNI",
    longName: "Bank Negara Indonesia",
    logo: PAYMENT_BRANDS.bni.image,
    brand: "bni",
    accountNumber: "123 456 7890",
    virtualAccountPrefix: "9888",
  },
  {
    id: "bri",
    name: "BRI",
    longName: "Bank Rakyat Indonesia",
    logo: PAYMENT_BRANDS.bri.image,
    brand: "bri",
    accountNumber: "5376 5950 1880 6500",
    virtualAccountPrefix: "26215",
  },
  {
    id: "mandiri",
    name: "Mandiri",
    longName: "Bank Mandiri",
    logo: PAYMENT_BRANDS.mandiri.image,
    brand: "mandiri",
    accountNumber: "123 00 4567890 1",
    virtualAccountPrefix: "70012",
  },
];

export const WALLET_OPTIONS: readonly WalletOption[] = [
  { id: "qris", name: "QRIS", brand: "qris", logo: PAYMENT_BRANDS.qris.image },
  { id: "gopay", name: "GoPay", brand: "gopay", logo: PAYMENT_BRANDS.gopay.image },
  { id: "ovo", name: "OVO", brand: "ovo", logo: PAYMENT_BRANDS.ovo.image },
];

export const DEFAULT_PAYMENT_DETAILS: PaymentDetailsValue = {
  bankTransferBank: "bni",
  virtualAccountBank: "bca",
  wallet: "qris",
};

export const getBankOption = (bankId: BankId) =>
  BANK_OPTIONS.find((bank) => bank.id === bankId) ?? BANK_OPTIONS[0];

export const getWalletOption = (walletId: WalletId) =>
  WALLET_OPTIONS.find((wallet) => wallet.id === walletId) ?? WALLET_OPTIONS[0];

export const getMethodLabel = (
  method: PaymentMethodId,
  details: PaymentDetailsValue,
) => {
  if (method === "bank-transfer") return "Transfer Bank (Manual)";

  if (method === "virtual-account") {
    return `Virtual Account (VA) ${getBankOption(details.virtualAccountBank).name}`;
  }

  return details.wallet === "qris"
    ? "QRIS / E-Wallet"
    : `${getWalletOption(details.wallet).name} / E-Wallet`;
};

export const getVirtualAccountNumber = (
  bankId: BankId,
  transactionId: string,
) => {
  const bank = getBankOption(bankId);
  const digits = transactionId.replace(/\D/g, "").slice(-10).padStart(10, "0");

  return `${bank.virtualAccountPrefix}${digits}`;
};
