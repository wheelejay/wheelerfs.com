import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { episodes, services } from 'virtual:content';
import { REVIEW_URL } from '../siteInfo';

const Layout = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const servicesRef = React.useRef(null);
  const { pathname, hash, key } = useLocation();

  // Scroll to the #section in the URL (e.g. /#contact), or to the top on a new
  // page. The section's heading lands just below the sticky header. `key`
  // changes on every click, so tapping the same link twice scrolls again.
  React.useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    const section = hash && document.getElementById(hash.slice(1));
    if (!section) {
      window.scrollTo(0, 0);
      return;
    }
    const target = section.querySelector('h2') || section;
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [pathname, hash, key]);

  // Close the Services dropdown when clicking outside it or pressing Escape
  React.useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e) => {
      if (!servicesRef.current?.contains(e.target)) setServicesOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [servicesOpen]);

  // Hamburger menu toggle
  const handleHamburgerClick = () => {
    setMenuOpen((open) => !open);
  };
  const handleNavLinkClick = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header role="banner">
        <div className="header-flex">
          <div className="logo">
            <Link to="/"><img src="/wheelerfslogo.png" alt="Wheeler Food Safety Logo" style={{ height: '80px', width: 'auto' }} /></Link>
          </div>
          <nav aria-label="Main navigation">
            <button
              className="hamburger"
              aria-label="Toggle menu"
              aria-controls="nav-links"
              aria-expanded={menuOpen ? 'true' : 'false'}
              onClick={handleHamburgerClick}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul
              id="nav-links"
              className={menuOpen ? 'active' : ''}
            >
              <li className={`nav-dropdown${servicesOpen ? ' open' : ''}`} ref={servicesRef}>
                <button
                  type="button"
                  className="nav-dropdown-toggle"
                  aria-expanded={servicesOpen ? 'true' : 'false'}
                  aria-controls="services-menu"
                  onClick={() => setServicesOpen((open) => !open)}
                >
                  Services <span className="nav-caret" aria-hidden="true">▾</span>
                </button>
                <ul id="services-menu" className="nav-submenu">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link to={`/services/${service.slug}`} onClick={handleNavLinkClick}>{service.title}</Link>
                    </li>
                  ))}
                  <li className="nav-submenu-all">
                    <Link to="/#services" onClick={handleNavLinkClick}>All services overview</Link>
                  </li>
                </ul>
              </li>
              <li><Link to="/#pricing" onClick={handleNavLinkClick}>Pricing</Link></li>
              <li><Link to="/#why-us" onClick={handleNavLinkClick}>Why Us</Link></li>
              <li><Link to="/blog" onClick={handleNavLinkClick}>Blog</Link></li>
              {episodes.length > 0 && <li><Link to="/podcast" onClick={handleNavLinkClick}>Podcast</Link></li>}
              <li><Link to="/#contact" onClick={handleNavLinkClick}>Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="footer-dark">
        <div className="footer-columns">
          <div>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800 }}>Wheeler Food Safety Services</strong>
            <div style={{ color: '#cfd8e3', marginTop: '0.5em', fontSize: '0.98rem', fontWeight: 400 }}>
              Professional food safety validation services<br />
              for Utah food manufacturers and related industries.
            </div>
          </div>
          <div>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800 }}>Services</strong>
            <div className="footer-service-links" style={{ marginTop: '0.5em', fontSize: '0.98rem', fontWeight: 400 }}>
              {services.map((service) => (
                <Link key={service.slug} to={`/services/${service.slug}`}>{service.title}</Link>
              ))}
            </div>
            <div style={{ marginTop: '0.8em', fontSize: '0.98rem', fontWeight: 400 }}>
              <Link to="/blog">Blog</Link>
              {episodes.length > 0 && <> · <Link to="/podcast">Podcast</Link></>}
              {' · '}<Link to="/portal">Customer portal</Link>
            </div>
          </div>
          <div>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800 }}>Contact</strong>
            <div style={{ marginTop: '0.5em', fontSize: '0.98rem', fontWeight: 400, color: '#cfd8e3' }}>
              <a href="mailto:Jordan@wheelerfs.com">Jordan@wheelerfs.com</a><br />
              <a href="tel:+13852015609">(385) 201-5609</a><br />
              <a href="https://www.wheelerfs.com" target="_blank" rel="noopener noreferrer">www.wheelerfs.com</a><br />
              <span style={{ color: '#cfd8e3', fontSize: '0.98rem', fontWeight: 400 }}>541 W 9560 S Sandy, UT 84070</span>
            </div>
            <a href={REVIEW_URL} className="footer-review-link" target="_blank" rel="noopener noreferrer">★ Leave us a Google review</a>
          </div>
        </div>
        <div className="footer-divider"></div>
        <p className="footer-copyright">© {new Date().getFullYear()} Wheeler Food Safety Service. A Meldrum Company.</p>
      </footer>
    </>
  );
};

export default Layout;
