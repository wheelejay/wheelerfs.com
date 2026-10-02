import { Link, useParams } from 'react-router-dom';
import usePageMeta from '../usePageMeta';
import formatDate from '../formatDate';
import NotFound from './NotFound';

// Shared page for a single blog post or podcast episode.
const ContentDetail = ({ items, basePath, backLabel, siteLabel }) => {
  const { slug } = useParams();
  const item = items.find((i) => i.slug === slug);

  usePageMeta({
    title: item ? `${item.seoTitle || item.title} | ${siteLabel}` : `Page not found | ${siteLabel}`,
    description: item?.excerpt,
  });

  if (!item) return <NotFound />;

  return (
    <main className="content-page">
      <article>
        <Link to={basePath} className="content-back">← {backLabel}</Link>
        {item.icon && <img src={item.icon} alt="" className="service-page-icon" />}
        <h1>
          {item.title}
          {item.draft && <span className="draft-badge">Draft</span>}
        </h1>
        {item.date && <time dateTime={item.date} className="content-date">{formatDate(item.date)}</time>}
        {item.price && (
          <p className="service-price">
            <strong>{item.price}</strong> {item.priceNote}
          </p>
        )}
        {!item.date && item.excerpt && <p className="content-intro">{item.excerpt}</p>}

        {item.embed && (
          <div className="episode-embed">
            <iframe
              src={item.embed}
              title={`${item.title} player`}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        )}
        {!item.embed && item.audio && (
          <audio className="episode-audio" controls preload="none" src={item.audio}>
            <a href={item.audio}>Download the episode</a>
          </audio>
        )}

        <div className="content-body" dangerouslySetInnerHTML={{ __html: item.html }} />

        <div className="content-cta">
          <p>Need your equipment validated before your next audit?</p>
          <Link to="/#contact" className="btn">Contact Us</Link>
        </div>
      </article>
    </main>
  );
};

export default ContentDetail;
