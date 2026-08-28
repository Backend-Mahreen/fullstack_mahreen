import { useEffect } from "react";
import NewsroomLayout from "../layout/NewsroomLayout";
import RegistrationForm from "./components/RegistrationForm";
import type { WebinarData } from "../../../data/webinars";

const styles = `

  .webinar-registration-page {
    width: 100%;
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    color: #ffffff;
    background: #000000;
    font-family: "DM Sans", Arial, Helvetica, sans-serif;
  }

  .webinar-registration-page,
  .webinar-registration-page *,
  .webinar-registration-page *::before,
  .webinar-registration-page *::after {
    box-sizing: border-box;
  }

  .webinar-registration-page__main {
    width: 100%;
    min-width: 0;
    padding-top: var(--navbar-height, 74px);
    background: #000000;
  }

  .webinar-registration-page__form-section {
    position: relative;
    isolation: isolate;
    display: flex;
    width: 100%;
    min-height: 580px;
    padding: clamp(38px, 4vw, 48px) 24px clamp(38px, 4vw, 52px);
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 16%, rgba(216, 184, 106, 0.035), transparent 30%),
      #000000;
  }

  .webinar-registration-page__form-section::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    background: rgba(255, 255, 255, 0.06);
  }

  .webinar-registration-page__form-wrap {
    width: min(100%, 650px);
  }

  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  @media (max-width: 680px) {
    .webinar-registration-page__form-section {
      min-height: 0;
      padding: 34px 15px 72px;
    }
  }
`;

type WebinarRegistrationProps = {
  webinar: WebinarData;
};

const WebinarRegistration = ({ webinar }: WebinarRegistrationProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="webinar-registration-page">
          <main className="webinar-registration-page__main">
          <section
            className="webinar-registration-page__form-section"
            aria-label="Webinar registration"
          >
            <div className="webinar-registration-page__form-wrap">
              <RegistrationForm webinar={webinar} key={webinar.slug} />
            </div>
          </section>

          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default WebinarRegistration;
