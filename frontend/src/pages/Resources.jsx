import { Link } from 'react-router-dom';
import { posts } from 'virtual:content';
import usePageMeta from '../usePageMeta';
import { RESOURCES_TITLE, RESOURCES_INTRO, downloads, guideSlugs, pdfUrl, previewUrl } from '../resources';

const Resources = () => {
  usePageMeta({ title: `${RESOURCES_TITLE} | Wheeler Food Safety`, description: RESOURCES_INTRO });
  const guides = guideSlugs.map((slug) => posts.find((p) => p.slug === slug)).filter(Boolean);

  return (
    <main className="content-page resources-page">
      <h1>{RESOURCES_TITLE}</h1>
      <p className="content-intro">{RESOURCES_INTRO}</p>

      <h2 className="resources-heading">Printable logs</h2>
      <ul className="resource-list">
        {downloads.map((d) => (
          <li key={d.file} className="resource-card">
            <a href={pdfUrl(d)} className="resource-preview" target="_blank" rel="noopener" aria-label={`Open ${d.title} (PDF)`}>
              <img src={previewUrl(d)} alt={`Preview of the ${d.title}`} width="600" height="464" loading="lazy" />
            </a>
            <div className="resource-body">
              <h3>{d.title}</h3>
              <p>{d.description}</p>
              <p className="resource-pages">{d.pages} Letter size, landscape. Free PDF.</p>
              <div className="resource-actions">
                <a href={pdfUrl(d)} className="btn btn-small" download>Download PDF</a>
                {d.guide && posts.some((p) => p.slug === d.guide) && (
                  <Link to={`/blog/${d.guide}/`}>How to use it</Link>
                )}
                <Link to={`/services/${d.service.slug}/`}>{d.service.label}</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {guides.length > 0 && (
        <>
          <h2 className="resources-heading">Helpful guides</h2>
          <ul className="resource-guides">
            {guides.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}/`}>{p.title}</Link>
              </li>
            ))}
          </ul>
          <p><Link to="/blog/">See all blog posts →</Link></p>
        </>
      )}

      <div className="resources-cta">
        <h2>Need a validation or calibration?</h2>
        <p>
          Wheeler Food Safety validates metal detectors, X-ray systems, and magnets, and calibrates thermometers and
          hygrometers, for food and supplement plants across Utah.
        </p>
        <Link to="/#contact" className="btn">Contact us</Link>
      </div>
    </main>
  );
};

export default Resources;
