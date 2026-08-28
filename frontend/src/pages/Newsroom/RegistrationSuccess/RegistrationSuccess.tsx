import { useEffect } from "react";
import NewsroomLayout from "../layout/NewsroomLayout";
import type { WebinarData } from "../../../data/webinars";
import SuccessContent from "./components/SuccessContent";

const styles = `

  .webinar-success-page {
    width: 100%;
    min-width: 0;
    min-height: 100dvh;
    overflow-x: clip;
    color: #ffffff;
    background: #000000;
    font-family: "DM Sans", Arial, Helvetica, sans-serif;
  }

  .webinar-success-page,
  .webinar-success-page *,
  .webinar-success-page *::before,
  .webinar-success-page *::after {
    box-sizing: border-box;
  }

  .webinar-success-page__main {
    width: 100%;
    min-width: 0;
    padding-top: var(--navbar-height, 74px);
    background: #000000;
  }

  .webinar-success-page__section {
    position: relative;
    isolation: isolate;
    display: grid;
    width: 100%;
    min-height: 760px;
    padding: clamp(52px, 6vw, 82px) clamp(18px, 5vw, 72px) clamp(76px, 8vw, 108px);
    overflow: hidden;
    place-items: start center;
    background:
      radial-gradient(circle at 50% 3%, rgba(214, 181, 101, 0.055), transparent 24%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.012), transparent 45%),
      #000000;
  }

  .webinar-success-page__section::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    background: rgba(255, 255, 255, 0.055);
  }

  @media (max-width: 680px) {
    .webinar-success-page__section {
      min-height: 0;
      padding: 43px 15px 74px;
    }
  }
`;

type RegistrationSuccessProps = {
  webinar: WebinarData;
};

const RegistrationSuccess = ({ webinar }: RegistrationSuccessProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="webinar-success-page">
          <main className="webinar-success-page__main">
          <section
            className="webinar-success-page__section"
            aria-label="Webinar registration success"
          >
            <SuccessContent webinar={webinar} key={webinar.slug} />
          </section>

          </main>
        </div>
      </NewsroomLayout>
    </>
  );
};

export default RegistrationSuccess;
