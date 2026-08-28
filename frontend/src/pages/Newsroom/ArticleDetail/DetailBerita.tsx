import { useEffect } from "react";
import authorAvatar from "../../../assets/Internship/dimas-andre.jpg";
import NewsroomLayout from "../layout/NewsroomLayout";
import { usePublishedNewsroomDatabase } from "../../../hooks/useNewsroomDatabase";
import { newsroomService } from "../../../services/newsroom/newsroomService";
import BeritaTerkait from "./components/BeritaTerkait";
import Informasi from "./components/Informasi";
import IsiBerita from "./components/IsiBerita";
import ArticleComments from "./components/ArticleComments";

const styles = `
  .newsroom-detail-page {
    --article-gold: #e5c477;
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: 100dvh;
    padding-top: var(--navbar-height, 74px);
    overflow-x: clip;
    color: #f4efe8;
    background: #000;
    font-family: Arial, Helvetica, sans-serif;
  }

  .newsroom-detail-page *,
  .newsroom-detail-page *::before,
  .newsroom-detail-page *::after {
    box-sizing: border-box;
  }

  .newsroom-detail-page [data-article-reveal] {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 720ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .newsroom-detail-page [data-article-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .newsroom-detail-hero {
    position: relative;
    display: flex;
    min-height: clamp(430px, 46vw, 560px);
    isolation: isolate;
    align-items: center;
    overflow: hidden;
    background: #070b0d;
  }

  .newsroom-detail-hero__image {
    position: absolute;
    inset: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    animation: newsroom-detail-image-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-detail-hero::before {
    position: absolute;
    inset: 0;
    z-index: -2;
    content: "";
    background:
      linear-gradient(90deg, rgba(2, 5, 7, 0.96) 0%, rgba(2, 5, 7, 0.84) 38%, rgba(2, 5, 7, 0.42) 66%, rgba(2, 5, 7, 0.34) 100%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.26) 58%, rgba(0, 0, 0, 0.78) 100%);
  }

  .newsroom-detail-hero::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    content: "";
    background: radial-gradient(circle at 57% 46%, rgba(229, 196, 119, 0.08), transparent 34%);
  }

  .newsroom-detail-hero__inner {
    width: min(100%, 1180px);
    margin-inline: auto;
    padding: clamp(56px, 6vw, 82px) clamp(42px, 9.8vw, 112px) clamp(48px, 5.2vw, 70px);
  }

  .newsroom-detail-hero__content {
    width: min(100%, 660px);
    animation: newsroom-detail-content-in 900ms 140ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .newsroom-detail-hero__meta {
    display: flex;
    margin-bottom: 28px;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    color: #aea79e;
    font-size: 11px;
    line-height: 1.4;
  }

  .newsroom-detail-hero__category {
    display: inline-flex;
    min-height: 27px;
    padding: 0 13px;
    align-items: center;
    border: 1px solid rgba(229, 196, 119, 0.38);
    border-radius: 999px;
    color: #e0bd6c;
    background: rgba(229, 196, 119, 0.13);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
  }

  .newsroom-detail-hero__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #766f67;
  }

  .newsroom-detail-hero__read-time {
    display: inline-flex;
    align-items: center;
  }

  .newsroom-detail-hero__title {
    max-width: 650px;
    margin: 0;
    color: #f1ece5;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(42px, 4.2vw, 62px);
    font-weight: 700;
    line-height: 1.07;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  .newsroom-detail-hero__author {
    display: flex;
    margin-top: 28px;
    align-items: center;
    gap: 12px;
  }

  .newsroom-detail-hero__avatar {
    width: 39px;
    height: 39px;
    object-fit: cover;
    border: 1px solid rgba(229, 196, 119, 0.28);
    border-radius: 50%;
    filter: saturate(0.72) brightness(0.86);
  }

  .newsroom-detail-hero__author-name,
  .newsroom-detail-hero__author-role {
    margin: 0;
  }

  .newsroom-detail-hero__author-name {
    color: #efe9e1;
    font-size: 11px;
    font-weight: 500;
  }

  .newsroom-detail-hero__author-role {
    margin-top: 3px;
    color: #aaa29a;
    font-size: 9px;
  }

  .newsroom-detail-content {
    position: relative;
    width: min(100%, 1280px);
    margin-inline: auto;
    padding: clamp(70px, 7vw, 105px) clamp(28px, 5vw, 72px) clamp(85px, 8vw, 120px);
  }

  .newsroom-detail-content__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(270px, 340px);
    align-items: start;
    gap: clamp(55px, 7vw, 105px);
  }

  .newsroom-detail-content__main {
    min-width: 0;
  }

  .newsroom-detail-content__aside {
    position: static;
    min-width: 0;
    align-self: start;
  }

  .newsroom-detail-content__aside-inner {
    position: static;
    display: grid;
    width: 100%;
    gap: 22px;
    overflow: visible;
    transform: none;
  }

  @keyframes newsroom-detail-image-in {
    from { opacity: 0; transform: scale(1.08); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes newsroom-detail-content-in {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 980px) {
    .newsroom-detail-content__grid {
      grid-template-columns: 1fr;
      gap: 58px;
    }

    .newsroom-detail-content__aside {
      align-self: auto;
    }

    .newsroom-detail-content__aside-inner {
      width: 100%;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .newsroom-detail-hero {
      min-height: 560px;
      align-items: flex-end;
    }

    .newsroom-detail-hero__image {
      object-position: 61% center;
    }

    .newsroom-detail-hero__inner {
      padding: 82px 22px 56px;
    }

    .newsroom-detail-hero__content {
      width: 100%;
    }

    .newsroom-detail-hero__meta {
      margin-bottom: 20px;
      gap: 9px;
      font-size: 10px;
    }

    .newsroom-detail-hero__title {
      font-size: clamp(38px, 11.5vw, 54px);
    }

    .newsroom-detail-content {
      padding: 62px 22px 82px;
    }

    .newsroom-detail-content__aside-inner {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .newsroom-detail-page [data-article-reveal],
    .newsroom-detail-hero__image,
    .newsroom-detail-hero__content {
      opacity: 1;
      transform: none;
      animation: none;
      transition: none;
    }
  }
`;

type DetailBeritaProps = {
  slug?: string;
};

const DetailBerita = ({ slug = "ekspansi-hub-kreatif-mahreen-di-jawa-barat" }: DetailBeritaProps) => {
  const { articles } = usePublishedNewsroomDatabase();
  const article =
    articles.find((item) => item.slug === slug) ??
    articles.find((item) => item.featured) ??
    articles[0];
  const articleSlug = article?.slug;

  useEffect(() => {
    if (!articleSlug) return;
    void newsroomService.recordView(articleSlug).catch(() => {
      // Artikel tetap dapat dibaca ketika penyimpanan statistik tidak tersedia.
    });
  }, [articleSlug]);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".newsroom-detail-page [data-article-reveal]:not(.is-visible)",
      ),
    );

    if (targets.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [slug]);


  if (!article) return null;
  return (
    <>
      <style>{styles}</style>

      <NewsroomLayout>
        <div className="newsroom-detail-page">

      <header className="newsroom-detail-hero">
        <img decoding="async" loading="lazy"
          className="newsroom-detail-hero__image"
          src={article.image}
          alt=""
          aria-hidden="true"
        />

        <div className="newsroom-detail-hero__inner">
          <div className="newsroom-detail-hero__content">
            <div className="newsroom-detail-hero__meta">
              <span className="newsroom-detail-hero__category">
                {article.category}
              </span>
              <span>{article.publishedAt}</span>
              <span className="newsroom-detail-hero__dot" aria-hidden="true" />
              <span className="newsroom-detail-hero__read-time">
                {article.readTime}
              </span>
            </div>

            <h1 className="newsroom-detail-hero__title">{article.detailTitle}</h1>

            <div className="newsroom-detail-hero__author">
              <img decoding="async" loading="lazy"
                className="newsroom-detail-hero__avatar"
                src={authorAvatar}
                alt={article.author}
              />
              <div>
                <p className="newsroom-detail-hero__author-name">{article.author}</p>
                <p className="newsroom-detail-hero__author-role">
                  Editorial Newsroom
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="newsroom-detail-content">
        <div className="newsroom-detail-content__grid">
          <div className="newsroom-detail-content__main">
            <IsiBerita article={article} />
            <ArticleComments slug={article.slug} />
          </div>

          <aside className="newsroom-detail-content__aside">
            <div className="newsroom-detail-content__aside-inner">
              <BeritaTerkait currentSlug={article.slug} />
              <Informasi />
            </div>
          </aside>
        </div>
      </main>

        </div>
      </NewsroomLayout>
    </>
  );
};

export default DetailBerita;
