import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  articleCommentsService,
  type ArticleComment,
} from "../../../../services/newsroom/articleCommentsService";

const styles = `
  .article-comments {
    width: 100%;
    margin-top: 52px;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .article-comments__title {
    margin: 0 0 6px;
    color: #e6e0d8;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 26px;
    font-weight: 400;
    line-height: 1.2;
  }

  .article-comments__line {
    width: 48px;
    height: 1px;
    margin-bottom: 22px;
    background: #e5c477;
  }

  .article-comments__list {
    display: grid;
    gap: 18px;
    margin-bottom: 30px;
  }

  .article-comments__empty {
    padding: 22px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #8b857d;
    font-size: 13px;
    line-height: 1.7;
    text-align: center;
  }

  .article-comments__item {
    padding: 18px 20px;
    border: 1px solid rgba(229, 196, 119, 0.14);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.025);
  }

  .article-comments__item-head {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .article-comments__author {
    margin: 0;
    color: #e5c477;
    font-size: 13px;
    font-weight: 700;
  }

  .article-comments__date {
    color: #8b857d;
    font-size: 10px;
  }

  .article-comments__content {
    margin: 0;
    color: #bbb4ab;
    font-size: 13px;
    line-height: 1.7;
  }

  .article-comments__form {
    display: grid;
    gap: 12px;
  }

  .article-comments__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .article-comments__input {
    width: 100%;
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    outline: none;
    color: #e6e0d8;
    background: #0f0e0d;
    font: inherit;
    font-size: 13px;
    transition: border-color 180ms ease;
  }

  .article-comments__input::placeholder { color: #6f6a62; }

  .article-comments__input:focus {
    border-color: rgba(229, 196, 119, 0.5);
  }

  .article-comments__textarea {
    min-height: 96px;
    padding: 12px 14px;
    resize: vertical;
  }

  .article-comments__button {
    justify-self: start;
    min-height: 42px;
    padding: 0 22px;
    border: 1px solid rgba(229, 196, 119, 0.5);
    border-radius: 999px;
    color: #e5c477;
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: background-color 180ms ease, color 180ms ease;
  }

  .article-comments__button:hover,
  .article-comments__button:focus-visible {
    color: #14100a;
    background: #e5c477;
  }

  .article-comments__button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .article-comments__status {
    margin: 0;
    color: #e5c477;
    font-size: 12px;
  }

  .article-comments__error {
    margin: 0;
    color: #e08d6c;
    font-size: 12px;
  }

  @media (max-width: 560px) {
    .article-comments__row { grid-template-columns: 1fr; }
  }
`;

type ArticleCommentsProps = {
  slug: string;
};

const formatCommentDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const ArticleComments = ({ slug }: ArticleCommentsProps) => {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    try {
      const items = await articleCommentsService.list(slug);
      setComments(items);
    } catch {
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async; setState terjadi setelah await, bukan sinkron.
    void loadComments();
  }, [loadComments]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setError("Nama dan isi komentar wajib diisi.");
      setStatus("");
      return;
    }

    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const created = await articleCommentsService.create(slug, {
        authorName: authorName.trim(),
        email: email.trim() || undefined,
        content: content.trim(),
      });
      setComments((current) => [...current, created]);
      setAuthorName("");
      setEmail("");
      setContent("");
      setStatus("Komentar berhasil dikirim.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Komentar gagal dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <section className="article-comments" aria-labelledby="article-comments-title" data-article-reveal>
        <h2 className="article-comments__title" id="article-comments-title">
          Komentar
        </h2>
        <div className="article-comments__line" aria-hidden="true" />

        {isLoading ? null : comments.length === 0 ? (
          <div className="article-comments__empty">
            Belum ada komentar. Jadilah yang pertama memberikan tanggapan.
          </div>
        ) : (
          <div className="article-comments__list">
            {comments.map((comment) => (
              <article className="article-comments__item" key={comment.id}>
                <div className="article-comments__item-head">
                  <h3 className="article-comments__author">{comment.authorName}</h3>
                  <time className="article-comments__date">
                    {formatCommentDate(comment.createdAt)}
                  </time>
                </div>
                <p className="article-comments__content">{comment.content}</p>
              </article>
            ))}
          </div>
        )}

        <form className="article-comments__form" onSubmit={handleSubmit} noValidate>
          <div className="article-comments__row">
            <input
              className="article-comments__input"
              type="text"
              placeholder="Nama Anda *"
              aria-label="Nama Anda"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              autoComplete="name"
            />
            <input
              className="article-comments__input"
              type="email"
              placeholder="Email (opsional)"
              aria-label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>
          <textarea
            className="article-comments__input article-comments__textarea"
            placeholder="Tulis komentar Anda... *"
            aria-label="Isi komentar"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          {status ? <p className="article-comments__status" role="status">{status}</p> : null}
          {error ? <p className="article-comments__error" role="alert">{error}</p> : null}
          <button className="article-comments__button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
          </button>
        </form>
      </section>
    </>
  );
};

export default ArticleComments;
