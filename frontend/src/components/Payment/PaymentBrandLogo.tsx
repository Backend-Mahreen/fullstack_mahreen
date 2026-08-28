import {
  getPaymentBrand,
  type PaymentBrandId,
} from "../../data/paymentBrands";

type PaymentBrandLogoProps = Readonly<{
  brand: PaymentBrandId;
  className?: string;
  decorative?: boolean;
}>;

const PaymentBrandLogo = ({
  brand,
  className,
  decorative = true,
}: PaymentBrandLogoProps) => {
  const paymentBrand = getPaymentBrand(brand);

  return (
    <img width="240" height="96"
      className={className}
      src={paymentBrand.image}
      alt={decorative ? "" : paymentBrand.label}
      aria-hidden={decorative ? "true" : undefined}
      decoding="async"
      loading="eager"
    />
  );
};

export default PaymentBrandLogo;
