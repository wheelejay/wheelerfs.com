import { Link } from 'react-router-dom';
import usePageMeta from '../usePageMeta';

const NotFound = () => {
  usePageMeta({ title: 'Page not found | Wheeler Food Safety', description: 'Page not found.' });

  return (
    <main className="content-page">
      <h1>Page not found</h1>
      <p className="content-intro">Sorry, we couldn't find that page.</p>
      <Link to="/" className="btn">Back to home</Link>
    </main>
  );
};

export default NotFound;
