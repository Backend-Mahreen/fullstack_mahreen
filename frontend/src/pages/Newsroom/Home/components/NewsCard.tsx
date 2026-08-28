import { ArrowRight, Clock3, UserRound } from "lucide-react";
import { handleNewsroomImageError } from "../../utils/newsroomImageFallback";

export type NewsCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  author: string;
  readTime: string;
  image: string;
  imageSrcSet?: string;
  imageSizes?: string;
  imageWidth?: number;
  imageHeight?: number;
  href: string;
};

const NewsCard = ({
  eyebrow,
  title,
  description,
  author,
  readTime,
  image,
  imageSrcSet,
  imageSizes,
  imageWidth,
  imageHeight,
  href,
}: NewsCardProps) => {
  return (
    <>

      <div className="newsroom-news-card">
        <a
          className="newsroom-news-card__image"
          href={href}
          data-newsroom-reveal
        >
          <img
            decoding="async"
            loading="lazy"
            src={image}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            width={imageWidth}
            height={imageHeight}
            alt={title}
            onError={handleNewsroomImageError}
          />
        </a>

        <article className="newsroom-news-card__copy" data-newsroom-reveal>
          <span className="newsroom-kicker">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>

          <div className="newsroom-news-card__meta">
            <span>
              <UserRound size={15} aria-hidden="true" />
              {author}
            </span>
            <span>
              <Clock3 size={15} aria-hidden="true" />
              {readTime}
            </span>
          </div>

          <a className="newsroom-inline-link" href={href}>
            Baca Selengkapnya
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </article>
      </div>
    </>
  );
};

export default NewsCard;
