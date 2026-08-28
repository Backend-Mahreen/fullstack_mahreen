import { useEffect } from "react";

type CSRPageEffectsProps = Readonly<{
  rootId: string;
}>;

const revealSelector = [
  ".csr-about__visual",
  ".csr-about__content",
  ".csr-stats__card",
  ".csr-pillars__card",
  ".csr-featured-programs__heading",
  ".csr-featured-programs__card",
  ".csr-daftar-sekarang__panel",
  ".po-overview__box",
  ".po-overview__feature",
  ".po-timeline__left",
  ".po-timeline__item",
  ".po-impact__card",
  ".po-docs__header",
  ".po-docs__img-wrap",
  ".po-testimonial__container",
  ".po-faq__left",
  ".po-faq__right",
].join(",");

const effectStyles = `
  /*
   * Efek CSR dibuat ringan: hanya opacity + transform.
   * Tidak ada scroll listener, blur besar, pointer tracking, atau animasi
   * background terus-menerus yang dapat membuat scrolling tersendat.
   */
  .csr-motion-surface {
    position: relative;
    overflow-x: clip;
  }

  .csr-motion-surface [data-csr-reveal] {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
    transition:
      opacity 520ms cubic-bezier(0.22, 1, 0.36, 1) var(--csr-reveal-delay, 0ms),
      transform 520ms cubic-bezier(0.22, 1, 0.36, 1) var(--csr-reveal-delay, 0ms);
  }

  .csr-motion-surface [data-csr-reveal="card"] {
    transform: translate3d(0, 16px, 0);
  }

  .csr-motion-surface [data-csr-reveal].is-csr-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .csr-motion-surface .csr-stats__card,
  .csr-motion-surface .csr-pillars__card,
  .csr-motion-surface .csr-featured-programs__card,
  .csr-motion-surface .csr-daftar-sekarang__panel,
  .csr-motion-surface .po-overview__box,
  .csr-motion-surface .po-impact__card,
  .csr-motion-surface .po-docs__img-wrap,
  .csr-motion-surface .po-faq__item {
    transition:
      transform 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .csr-motion-surface .csr-featured-programs__image,
  .csr-motion-surface .po-docs__img-wrap img,
  .csr-motion-surface .csr-daftar-sekarang__image {
    transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .csr-motion-surface .csr-hero__button,
  .csr-motion-surface .csr-daftar-sekarang__button,
  .csr-motion-surface .po-hero__btn {
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease;
  }

  @media (hover: hover) and (pointer: fine) {
    .csr-motion-surface .csr-stats__card:hover,
    .csr-motion-surface .csr-pillars__card:hover,
    .csr-motion-surface .csr-featured-programs__card:hover,
    .csr-motion-surface .csr-daftar-sekarang__panel:hover,
    .csr-motion-surface .po-overview__box:hover,
    .csr-motion-surface .po-impact__card:hover,
    .csr-motion-surface .po-docs__img-wrap:hover,
    .csr-motion-surface .po-faq__item:hover {
      transform: translate3d(0, -3px, 0);
      border-color: rgba(229, 196, 131, 0.28) !important;
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
    }

    .csr-motion-surface .csr-featured-programs__card:hover .csr-featured-programs__image,
    .csr-motion-surface .po-docs__img-wrap:hover img,
    .csr-motion-surface .csr-daftar-sekarang__panel:hover .csr-daftar-sekarang__image {
      transform: scale(1.025);
    }

    .csr-motion-surface .csr-hero__button:hover,
    .csr-motion-surface .csr-daftar-sekarang__button:hover,
    .csr-motion-surface .po-hero__btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    }
  }

  @media (max-width: 768px) {
    .csr-motion-surface [data-csr-reveal] {
      transform: translate3d(0, 14px, 0);
      transition-duration: 420ms;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .csr-motion-surface [data-csr-reveal],
    .csr-motion-surface .csr-stats__card,
    .csr-motion-surface .csr-pillars__card,
    .csr-motion-surface .csr-featured-programs__card,
    .csr-motion-surface .csr-daftar-sekarang__panel,
    .csr-motion-surface .po-overview__box,
    .csr-motion-surface .po-impact__card,
    .csr-motion-surface .po-docs__img-wrap,
    .csr-motion-surface .po-faq__item,
    .csr-motion-surface .csr-featured-programs__image,
    .csr-motion-surface .po-docs__img-wrap img,
    .csr-motion-surface .csr-daftar-sekarang__image,
    .csr-motion-surface .csr-hero__button,
    .csr-motion-surface .csr-daftar-sekarang__button,
    .csr-motion-surface .po-hero__btn {
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

const CSRPageEffects = ({ rootId }: CSRPageEffectsProps) => {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    root.classList.add("csr-motion-surface");

    const sections = Array.from(root.querySelectorAll<HTMLElement>("section"));
    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>(revealSelector),
    );

    sections.forEach((section, index) => {
      section.dataset.csrReveal = index === 0 ? "hero" : "section";
      section.style.setProperty(
        "--csr-reveal-delay",
        index === 0 ? "40ms" : "0ms",
      );
    });

    revealItems.forEach((item, index) => {
      item.dataset.csrReveal = "card";
      item.style.setProperty(
        "--csr-reveal-delay",
        `${Math.min(index % 4, 3) * 45}ms`,
      );
    });

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-csr-reveal]"),
    );

    let observer: IntersectionObserver | null = null;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => {
        element.classList.add("is-csr-visible");
      });
    } else {
      observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-csr-visible");
            currentObserver.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -6% 0px",
          threshold: 0.06,
        },
      );

      revealTargets.forEach((element) => observer?.observe(element));
    }

    const firstSection = sections[0];
    firstSection?.classList.add("is-csr-visible");

    return () => {
      observer?.disconnect();

      revealTargets.forEach((element) => {
        element.classList.remove("is-csr-visible");
        delete element.dataset.csrReveal;
        element.style.removeProperty("--csr-reveal-delay");
      });

      root.classList.remove("csr-motion-surface");
    };
  }, [rootId]);

  return <style data-component="csr-page-effects">{effectStyles}</style>;
};

export default CSRPageEffects;
