import { useEffect } from "react";
import NewsroomLayout from "../layout/NewsroomLayout";
import type { WebinarData } from "../../../data/webinars";
import PaymentForm from "./components/PaymentForm";

const styles = `

  .webinar-payment-page {
    width: 100%;
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    color: #ffffff;
    background: #000000;
    font-family: "DM Sans", Arial, Helvetica, sans-serif;
  }

  .webinar-payment-page,
  .webinar-payment-page *,
  .webinar-payment-page *::before,
  .webinar-payment-page *::after {
    box-sizing: border-box;
  }

  .webinar-payment-page__main {
    width: 100%;
    min-width: 0;
    padding-top: var(--navbar-height, 74px);
    background: #000000;
  }

  .webinar-payment-page__section {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-height: 680px;
    padding: clamp(42px, 5vw, 66px) clamp(18px, 5vw, 74px) clamp(64px, 7vw, 92px);
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 7%, rgba(216, 184, 106, 0.035), transparent 30%),
      #000000;
  }

  .webinar-payment-page__section::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    background: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 680px) {
    .webinar-payment-page__section {
      min-height: 0;
      padding: 34px 15px 72px;
    }
  }
`;

type WebinarPaymentProps = {
  webinar: WebinarData;
};

const WebinarPayment = ({ webinar }: WebinarPaymentProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="webinar-payment-page">
          <main className="webinar-payment-page__main">
          <section className="webinar-payment-page__section" aria-label="Webinar payment">
            <PaymentForm webinar={webinar} key={webinar.slug} />
          </section>

          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default WebinarPayment;
