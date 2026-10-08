import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { posts, episodes, services } from 'virtual:content';
import Layout from './components/Layout';
import Home from './pages/Home';
import ContentList from './pages/ContentList';
import ContentDetail from './pages/ContentDetail';
import NotFound from './pages/NotFound';
// Loaded on demand so the Supabase library only downloads on these pages.
const Portal = lazy(() => import('./pages/Portal'));
const Verify = lazy(() => import('./pages/Verify'));
const lazyPage = (page) => (
  <Suspense fallback={<main className="content-page"><p>Loading…</p></main>}>{page}</Suspense>
);
import './style.css';
import './content.css';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route
        path="blog"
        element={
          <ContentList
            items={posts}
            basePath="/blog"
            title="Blog"
            metaTitle="Blog | Wheeler Food Safety"
            intro="Food safety validation tips and audit prep for Utah food manufacturers, from Wheeler Food Safety."
            emptyMessage="Our first posts are on the way. Check back soon!"
          />
        }
      />
      <Route
        path="services/:slug"
        element={<ContentDetail items={services} basePath="/#services" backLabel="All services" siteLabel="Wheeler Food Safety" />}
      />
      <Route
        path="blog/:slug"
        element={<ContentDetail items={posts} basePath="/blog" backLabel="All posts" siteLabel="Wheeler Food Safety" />}
      />
      {episodes.length > 0 && (
        <>
          <Route
            path="podcast"
            element={
              <ContentList
                items={episodes}
                basePath="/podcast"
                title="Podcast"
                metaTitle="Podcast | Wheeler Food Safety"
                intro="Conversations on food safety, equipment validation, and audit readiness."
                emptyMessage=""
              />
            }
          />
          <Route
            path="podcast/:slug"
            element={<ContentDetail items={episodes} basePath="/podcast" backLabel="All episodes" siteLabel="Wheeler Food Safety Podcast" />}
          />
        </>
      )}
      <Route path="portal" element={lazyPage(<Portal />)} />
      <Route path="verify" element={lazyPage(<Verify />)} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
