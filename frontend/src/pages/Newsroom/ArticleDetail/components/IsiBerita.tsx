import type { NewsroomArticleRecord } from "../../../../data/newsroomLocalDatabase";

const styles = `
  .article-body {
    min-width: 0;
    color: #bbb4ab;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    line-height: 1.9;
  }

  .article-body__lead {
    margin: 0 0 28px;
    color: #e6e0d8;
    font-size: 17px;
    line-height: 1.8;
  }

  .article-body p {
    margin: 0 0 22px;
  }

  .article-body h2 {
    margin: 42px 0 18px;
    color: #e5c477;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(29px, 2.35vw, 38px);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .article-body__figure {
    margin: 42px 0 44px;
  }

  .article-body__image-wrap {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(229, 196, 119, 0.16);
    border-radius: 12px;
    background: #161513;
  }

  .article-body__image-wrap::after {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background: linear-gradient(180deg, transparent 58%, rgba(0, 0, 0, 0.65));
  }

  .article-body__image {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 8.5;
    object-fit: cover;
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .article-body__figure:hover .article-body__image {
    transform: scale(1.025);
  }

  .article-body__caption {
    position: absolute;
    right: 22px;
    bottom: 18px;
    left: 22px;
    z-index: 1;
    margin: 0;
    color: rgba(245, 239, 230, 0.82);
    font-size: 10px;
    font-style: italic;
    line-height: 1.55;
  }

  .article-body__quote {
    position: relative;
    margin: 42px 0;
    padding: 30px 32px 30px 36px;
    overflow: hidden;
    border: 1px solid rgba(229, 196, 119, 0.12);
    border-left: 3px solid #e5c477;
    border-radius: 10px;
    color: #d6cec4;
    background:
      radial-gradient(circle at 100% 0%, rgba(229, 196, 119, 0.08), transparent 42%),
      linear-gradient(145deg, #151412, #0d0c0b);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20px;
    font-style: italic;
    line-height: 1.65;
  }

  .article-body__gallery {
    display: grid;
    margin: 46px 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .article-body__gallery-item {
    position: relative;
    min-height: 220px;
    margin: 0;
    overflow: hidden;
    border: 1px solid rgba(229, 196, 119, 0.16);
    border-radius: 10px;
    background: #161513;
  }

  .article-body__gallery-item:nth-child(3n + 1) {
    grid-column: span 2;
    min-height: 340px;
  }

  .article-body__gallery-item img {
    width: 100%;
    height: 100%;
    min-height: inherit;
    object-fit: cover;
    transition: filter 500ms ease, transform 850ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .article-body__gallery-item::after {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background: linear-gradient(180deg, transparent 68%, rgba(0, 0, 0, 0.52));
  }

  .article-body__gallery-item:hover img {
    filter: saturate(1.08) brightness(1.04);
    transform: scale(1.035);
  }

  .article-body__quote footer {
    margin-top: 16px;
    color: #a99770;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .article-body__ending {
    margin-top: 44px;
    padding-top: 28px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 720px) {
    .article-body {
      font-size: 14px;
      line-height: 1.82;
    }

    .article-body__lead {
      font-size: 16px;
    }

    .article-body__quote {
      padding: 26px 24px 26px 28px;
      font-size: 18px;
    }

    .article-body__caption {
      right: 16px;
      bottom: 14px;
      left: 16px;
    }

    .article-body__gallery { grid-template-columns: 1fr; }
    .article-body__gallery-item,
    .article-body__gallery-item:nth-child(3n + 1) {
      grid-column: auto;
      min-height: 230px;
    }
  }
`;

type IsiBeritaProps = {
  article: NewsroomArticleRecord;
};

const IsiBerita = ({ article }: IsiBeritaProps) => {
  const content = article?.content;

  if (!content) return null;

  return (
    <>
      <style>{styles}</style>

      <article className="article-body">
        <p className="article-body__lead" data-article-reveal>
          {content.lead}
        </p>

        {content.sections.map((section, index) => (
          <div key={section.heading}>
            <h2 data-article-reveal>{section.heading}</h2>
            <div data-article-reveal>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {index === 0 && content.figure && (
              <figure className="article-body__figure" data-article-reveal>
                <div className="article-body__image-wrap">
                  <img
                    className="article-body__image"
                    src={content.figure.image}
                    alt={content.figure.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="article-body__caption">
                    {content.figure.caption}
                  </figcaption>
                </div>
              </figure>
            )}
          </div>
        ))}

        {content.quote && (
          <blockquote className="article-body__quote" data-article-reveal>
            “{content.quote.text}”
            <footer>{content.quote.author}</footer>
          </blockquote>
        )}

        {article.gallery && article.gallery.length > 0 ? (
          <section className="article-body__gallery" aria-label="Galeri artikel" data-article-reveal>
            {article.gallery.map((image, index) => (
              <figure className="article-body__gallery-item" key={`${image.src}-${index}`}>
                <img src={image.src} alt={image.alt || `Galeri artikel ${index + 1}`} loading="lazy" decoding="async" />
              </figure>
            ))}
          </section>
        ) : null}

        <p className="article-body__ending" data-article-reveal>
          Informasi lanjutan, pembaruan program, dan agenda terkait akan tersedia
          melalui Newsroom Mahreen Indonesia.
        </p>
      </article>
    </>
  );
};

export default IsiBerita;
