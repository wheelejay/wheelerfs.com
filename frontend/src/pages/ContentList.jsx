import { Link } from 'react-router-dom';
import usePageMeta from '../usePageMeta';
import formatDate from '../formatDate';

// Shared list page for blog posts and podcast episodes.
const ContentList = ({ items, basePath, title, intro, metaTitle, emptyMessage }) => {
  usePageMeta({ title: metaTitle, description: intro });

  return (
    <main className="content-page">
      <h1>{title}</h1>
      <p className="content-intro">{intro}</p>
      {items.length === 0 ? (
        <p className="content-empty">{emptyMessage}</p>
      ) : (
        <ul className="content-list">
          {items.map((item) => (
            <li key={item.slug}>
              <Link to={`${basePath}/${item.slug}`} className="content-list-item">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <h2>
                  {item.title}
                  {item.draft && <span className="draft-badge">Draft</span>}
                </h2>
                {item.excerpt && <p>{item.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ContentList;
