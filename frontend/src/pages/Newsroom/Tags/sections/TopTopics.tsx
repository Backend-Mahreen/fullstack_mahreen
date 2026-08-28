import { BookOpen } from "lucide-react";
import useNewsroomDatabase from "../../../../hooks/useNewsroomDatabase";

type TopTopicsProps = {
  onSelectTopic: (topic: string) => void;
};

const TopTopics = ({ onSelectTopic }: TopTopicsProps) => {
  const { topics } = useNewsroomDatabase();
  const topTopics = [...topics]
    .sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0))
    .slice(0, 3);

  return (
    <section className="newsroom-content-section" aria-labelledby="top-topics-title">
      <h2 id="top-topics-title" className="visually-hidden">
        Topik utama
      </h2>
      <div className="topics-grid-3">
        {topTopics.map((topic, index) => (
          <article
            className="topic-card-large"
            data-newsroom-reveal
            style={{ transitionDelay: `${100 + index * 100}ms` }}
            key={topic.id || topic.slug || index}
          >
            <div className="topic-icon-lg" aria-hidden="true">
              <BookOpen width={32} height={32} strokeWidth={1.5} />
            </div>
            <h3 className="tag-title-serif">{topic.name}</h3>
            <div className="topic-stats">
              <div className="stat-item">
                <h4>{topic.articleCount || 0}</h4>
                <span>ARTICLES</span>
              </div>
              <div className="stat-item">
                <h4>{topic.webinarCount || 0}</h4>
                <span>WEBINARS</span>
              </div>
            </div>
            <button
              className="btn-pill-gold"
              type="button"
              onClick={() => onSelectTopic(topic.name)}
            >
              Lihat Topik
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopTopics;
