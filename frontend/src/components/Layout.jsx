import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { episodes } from 'virtual:content';

const Layout = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { pathname, hash } = useLocation();

  // Scroll to the #section in the URL (e.g. /#contact), or to the top on a new page
  React.useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  // Hamburger menu toggle
  const handleHamburgerClick = () => {
    setMenuOpen((open) => !open);
  };
  const handleNavLinkClick = () => {
    setMenuOpen(false);
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
              <li><Link to="/#services" onClick={handleNavLinkClick}>Services</Link></li>
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
            <div style={{ color: '#cfd8e3', marginTop: '0.5em', fontSize: '0.98rem', fontWeight: 400 }}>
              Metal Detector Validation<br />
              X-ray System Validation<br />
              Magnet Validation<br />
              Temperature Mapping
            </div>
            <div style={{ marginTop: '0.8em', fontSize: '0.98rem', fontWeight: 400 }}>
              <Link to="/blog">Blog</Link>
              {episodes.length > 0 && <> · <Link to="/podcast">Podcast</Link></>}
            </div>
          </div>
          <div>
            <strong style={{ fontSize: '1.15rem', fontWeight: 800 }}>Contact</strong>
            <div style={{ marginTop: '0.5em', fontSize: '0.98rem', fontWeight: 400, color: '#cfd8e3' }}>
              <a href="mailto:Jordan@wheelerfs.com">Jordan@wheelerfs.com</a><br />
              <a href="tel:8019718838">(801) 971-8838</a><br />
              <a href="https://www.wheelerfs.com" target="_blank" rel="noopener noreferrer">www.wheelerfs.com</a><br />
              <span style={{ color: '#cfd8e3', fontSize: '0.98rem', fontWeight: 400 }}>541 W 9560 S Sandy, UT 84070</span>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <p className="footer-copyright">© {new Date().getFullYear()} Wheeler Food Safety Service. A Meldrum Company.</p>
      </footer>
    </>
  );
};

export default Layout;
