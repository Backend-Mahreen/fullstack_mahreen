import { useEffect, useRef } from "react";
import meetingImg from "../../../assets/Purpose/meeting-480.webp";
import meetingImgMedium from "../../../assets/Purpose/meeting-768.webp";
import meetingImgLarge from "../../../assets/Purpose/meeting-1024.webp";

const purposeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPageElement",
  name: "Tujuan Mahreen Indonesia",
  description:
    "Mahreen Indonesia membangun ide, mengembangkan kreativitas, dan menciptakan dampak melalui kolaborasi, pendidikan, teknologi, dan solusi kreatif.",
  isPartOf: {
    "@type": "WebPage",
    name: "Beranda Mahreen Indonesia",
  },
};

const purposeStyles = `

  @keyframes fadeInUpPurpose {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes revealImagePurpose {
    from {
      opacity: 0;
      transform: scale(0.95) translateX(20px);
    }

    to {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }

  .purpose {
    width: 100%;
    background-color: #050505;
    padding: 76px 22px 78px;
    overflow: hidden;
  }

  .purpose *,
  .purpose *::before,
  .purpose *::after {
    box-sizing: border-box;
  }

  .purpose .container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 0.95fr;
    align-items: center;
    gap: 90px;
  }

  .purpose .textCol {
    width: 100%;
    max-width: 680px;
    color: #f5f5f5;
    text-align: left;
  }

  .purpose .eyebrow {
    display: block;
    margin: 0 0 20px 0;
    color: #b99a67;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-align: left;
  }

  .purpose .heading {
    margin: 0 0 26px 0;
    color: #ffffff;
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(56px, 5.4vw, 76px);
    line-height: 0.94;
    font-weight: 700;
    letter-spacing: -1.6px;
    text-align: left;
  }

  .purpose .headingAccent {
    display: inline-block;
    color: #d4b078;
    font-style: italic;
    font-weight: 500;
  }

  .purpose .description {
    max-width: 600px;
    margin: 0 0 42px 0;
    color: rgba(255, 255, 255, 0.7);
    font-family: "Inter", Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.65;
    letter-spacing: -0.1px;
    text-align: left;
  }

  .purpose .cta {
    width: fit-content;
    min-width: 156px;
    height: 52px;
    padding: 0 34px;
    background-color: #d7b37b;
    color: #111111;
    border: none;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .purpose .cta:hover {
    background-color: #eed295;
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(215, 179, 123, 0.35);
    text-decoration: none;
  }

  .purpose .cta:active {
    transform: translateY(0) scale(0.96);
    box-shadow: none;
  }

  .purpose .cta:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 3px;
  }

  .purpose .imageCol {
    width: 100%;
    height: 385px;
    margin: 0;
    border-radius: 10px;
    overflow: hidden;
  }

  .purpose .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s ease;
  }

  .purpose .imageCol:hover .image {
    transform: scale(1.05);
  }

  .purpose .srOnly {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .purpose.is-reveal-ready .eyebrow,
  .purpose.is-reveal-ready .heading,
  .purpose.is-reveal-ready .description,
  .purpose.is-reveal-ready .cta,
  .purpose.is-reveal-ready .imageCol {
    opacity: 0;
  }

  .purpose.is-visible .eyebrow {
    animation: fadeInUpPurpose 0.8s ease-out 0.1s forwards;
  }

  .purpose.is-visible .heading {
    animation: fadeInUpPurpose 0.8s ease-out 0.3s forwards;
  }

  .purpose.is-visible .description {
    animation: fadeInUpPurpose 0.8s ease-out 0.5s forwards;
  }

  .purpose.is-visible .cta {
    animation: fadeInUpPurpose 0.8s ease-out 0.7s forwards;
  }

  .purpose.is-visible .imageCol {
    animation: revealImagePurpose 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards;
  }

  @media (max-width: 1100px) {
    .purpose {
      padding: 68px 22px;
    }

    .purpose .container {
      max-width: 960px;
      gap: 58px;
    }

    .purpose .heading {
      font-size: clamp(48px, 5.8vw, 64px);
    }

    .purpose .description {
      font-size: 14px;
    }

    .purpose .imageCol {
      height: 330px;
    }
  }

  @media (max-width: 900px) {
    .purpose {
      padding: 64px 22px;
    }

    .purpose .container {
      grid-template-columns: 1fr;
      gap: 42px;
    }

    .purpose .textCol {
      max-width: 620px;
    }

    .purpose .heading {
      font-size: clamp(44px, 9vw, 58px);
    }

    .purpose .description {
      max-width: 560px;
      font-size: 14px;
    }

    .purpose .imageCol {
      height: 300px;
    }
  }

  @media (max-width: 560px) {
    .purpose {
      padding: 54px 20px;
    }

    .purpose .eyebrow {
      font-size: 14px;
      margin-bottom: 16px;
    }

    .purpose .heading {
      font-size: 42px;
      line-height: 1;
      margin-bottom: 22px;
    }

    .purpose .description {
      font-size: 14px;
      line-height: 1.65;
      margin-bottom: 32px;
    }

    .purpose .cta {
      min-width: 142px;
      height: 46px;
      font-size: 14px;
      padding: 0 28px;
    }

    .purpose .imageCol {
      height: 240px;
      border-radius: 8px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .purpose.is-reveal-ready .eyebrow,
    .purpose.is-reveal-ready .heading,
    .purpose.is-reveal-ready .description,
    .purpose.is-reveal-ready .cta,
    .purpose.is-reveal-ready .imageCol {
      opacity: 1;
    }

    .purpose.is-visible .eyebrow,
    .purpose.is-visible .heading,
    .purpose.is-visible .description,
    .purpose.is-visible .cta,
    .purpose.is-visible .imageCol {
      animation: none;
    }

    .purpose .cta,
    .purpose .image {
      transition: none;
    }

    .purpose .cta:hover,
    .purpose .imageCol:hover .image {
      transform: none;
    }
  }
`;

const Purpose = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      sectionElement.classList.add("is-visible");
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      sectionElement.classList.add("is-visible");
      return;
    }

    sectionElement.classList.add("is-reveal-ready");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionElement.classList.add("is-visible");
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style data-component="purpose">{purposeStyles}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(purposeJsonLd),
        }}
      />

      <section
        className="purpose"
        id="purpose"
        ref={sectionRef}
        aria-labelledby="purpose-title"
      >
        <div className="container">
          <div className="textCol">
            <p className="eyebrow">Our Purpose</p>

            <h2 className="heading" id="purpose-title">
              Building Ideas.
              <br />
              <span className="headingAccent">Creating Impact.</span>
            </h2>

            <p className="description">
              Kami percaya bahwa setiap ide memiliki potensi menjadi inovasi.
              Melalui sinergi, kreativitas, dan kolaborasi, kami menghadirkan
              solusi yang memberikan dampak nyata bagi masyarakat.
            </p>

            <a
              href="/tentang"
              className="cta"
              aria-label="Pelajari lebih lanjut tentang tujuan Mahreen Indonesia"
            >
              Selengkapnya
            </a>
          </div>

          <figure className="imageCol">
            <img
              src={meetingImg}
              srcSet={`${meetingImg} 480w, ${meetingImgMedium} 768w, ${meetingImgLarge} 1024w`}
              sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 44px), (max-width: 1100px) 44vw, 620px"
              alt="Tim Mahreen Indonesia sedang berdiskusi ide kreatif dan strategi kolaborasi"
              className="image"
              loading="lazy"
              decoding="async"
              width={620}
              height={385}
            />
            <figcaption className="srOnly">
              Diskusi tim sebagai bagian dari proses pengembangan ide,
              kreativitas, dan kolaborasi Mahreen Indonesia.
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
};

export default Purpose;
