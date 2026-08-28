import bcaLogo from "../assets/Newsroom/payment-banks/bca.svg";
import bniLogo from "../assets/Newsroom/payment-banks/bni.svg";
import briLogo from "../assets/Newsroom/payment-banks/bri.svg";
import mandiriLogo from "../assets/Newsroom/payment-banks/mandiri.svg";
import bankTransferLogo from "../assets/payments/bank-transfer.svg";
import gopayLogo from "../assets/payments/gopay.svg";
import ovoLogo from "../assets/payments/ovo.svg";
import qrisLogo from "../assets/payments/qris.svg";
import shopeepayLogo from "../assets/payments/shopeepay.svg";
import virtualAccountLogo from "../assets/payments/virtual-account.svg";

export type PaymentBrandId =
  | "bank-transfer"
  | "virtual-account"
  | "qris"
  | "shopeepay"
  | "gopay"
  | "ovo"
  | "bca"
  | "bni"
  | "bri"
  | "mandiri";

export type PaymentBrand = Readonly<{
  id: PaymentBrandId;
  label: string;
  image: string;
}>;

export const PAYMENT_BRANDS: Readonly<Record<PaymentBrandId, PaymentBrand>> = {
  "bank-transfer": { id: "bank-transfer", label: "Transfer Bank", image: bankTransferLogo },
  "virtual-account": { id: "virtual-account", label: "Virtual Account", image: virtualAccountLogo },
  qris: { id: "qris", label: "QRIS", image: qrisLogo },
  shopeepay: { id: "shopeepay", label: "ShopeePay", image: shopeepayLogo },
  gopay: { id: "gopay", label: "GoPay", image: gopayLogo },
  ovo: { id: "ovo", label: "OVO", image: ovoLogo },
  bca: { id: "bca", label: "BCA", image: bcaLogo },
  bni: { id: "bni", label: "BNI", image: bniLogo },
  bri: { id: "bri", label: "BRI", image: briLogo },
  mandiri: { id: "mandiri", label: "Bank Mandiri", image: mandiriLogo },
};

export const getPaymentBrand = (id: PaymentBrandId) => PAYMENT_BRANDS[id];
