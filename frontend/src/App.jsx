
import React, { useRef } from 'react';
import './style.css';



const App = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);


  // Contact form state
  const [contactStatus, setContactStatus] = React.useState('');
  const [contactLoading, setContactLoading] = React.useState(false);

  // Handle contact form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('');
    setContactLoading(true);
    const form = e.currentTarget;
    const name = form.elements.namedItem('name').value.trim();
    const email = form.elements.namedItem('email').value.trim();
    const message = form.elements.namedItem('message').value.trim();

    if (!name || !email || !message) {
      setContactStatus('Please fill in all fields.');
      setContactLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (!res.ok) throw new Error('Failed to send message.');
      setContactStatus('Thank you! Your message has been sent.');
      form.reset();
    } catch {
      setContactStatus('Failed to send message. Please try again later.');
    }
    setContactLoading(false);
  };

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
        <div className="logo">
          <img src="/wheelerfslogo.png" alt="Wheeler Food Safety Logo" style={{ height: '80px', width: 'auto' }} />
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
            <li><a href="#services" onClick={handleNavLinkClick}>Services</a></li>
            <li><a href="#pricing" onClick={handleNavLinkClick}>Pricing</a></li>
            <li><a href="#why-us" onClick={handleNavLinkClick}>Why Us</a></li>
            <li><a href="#contact" onClick={handleNavLinkClick}>Contact</a></li>
          </ul>
        </nav>
      </header>

  <main>
  {/* Hero Section */}
  <section className="hero" tabIndex={-1} style={{ background: '#fff' }}>
          <h1 style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.1 }}>Food Safety Validation <span style={{ color: '#16A34A' }}>Services</span></h1>
          <p style={{ fontSize: '1.2rem', color: '#01426A' }}>Serving Utah food manufacturers and related industries with professional metal detector, X-ray system, magnet, and temperature validation services.</p>
          <a href="#contact" className="btn" style={{ fontSize: '1.25rem', padding: '1.1rem 2.2rem' }}>
            Contact Us
          </a>
        </section>

        {/* Services Section */}
  <section id="services" className="services" style={{ background: '#f7fafc' }}>
          <h2>Professional Validation Services</h2>
          <h3 style={{ textAlign: 'center', color: '#01426A', fontSize: '1.18rem', marginBottom: '2.2rem', fontWeight: 500 }}>Comprehensive food safety validation services to ensure your equipment meets industry standards and regulatory requirements.</h3>
          <div className="service-cards">
            <div className="card" style={{ alignItems: 'center' }}>
              <span aria-label="Metal Detector" style={{ display: 'block', textAlign: 'center', marginBottom: '0' }}>
                <img src="/shield.png" alt="Metal Detector Shield Icon" style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'inline-block', marginBottom: '-4.4rem' }} />
              </span>
              <h3 style={{ fontSize: '2rem' }}>Metal Detector Validation</h3>
              <p>Sensitivity testing with Fe/NFe/SS test samples and full audit-ready reports.</p>
            </div>
            <div className="card" style={{ alignItems: 'center' }}>
              <span aria-label="X-ray" style={{ display: 'block', textAlign: 'center', marginBottom: '0' }}>
                <img src="/magglass.png" alt="X-ray Magnifying Glass Icon" style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'inline-block', marginBottom: '-4.4rem' }} />
              </span>
              <h3 style={{ fontSize: '2rem' }}>X-ray System Validation</h3>
              <p>Detectability testing using certified contaminants with traceable documentation.</p>
            </div>
            <div className="card" style={{ alignItems: 'center' }}>
              <span aria-label="Magnet" style={{ display: 'block', textAlign: 'center', marginBottom: '0' }}>
                <img src="/magnet.png" alt="Magnet Icon" style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'inline-block', marginBottom: '-4.4rem' }} />
              </span>
              <h3 style={{ fontSize: '2rem' }}>Magnet Validation</h3>
              <p>Visual inspection, magnetic strength testing, and capture efficiency analysis.</p>
            </div>
            <div className="card" style={{ alignItems: 'center' }}>
              <span aria-label="Thermometer" style={{ display: 'block', textAlign: 'center', marginBottom: '0' }}>
                <img src="/thermometer.png" alt="Thermometer Icon" style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'inline-block', marginBottom: '-4.4rem' }} />
              </span>
              <h3 style={{ fontSize: '2rem' }}>Temperature Mapping</h3>
              <p>Comprehensive temperature mapping for ambient/cold rooms and high temperature with validated loggers.</p>
            </div>
          </div>
        </section>

         {/* Pricing Section (moved below services, card style updated) */}
  <section id="pricing" className="pricing-section" style={{ background: '#fff', padding: '6.5rem 0 2.5rem 0', borderBottom: '1.5px solid #e0e7ef' }}>
          <h2 style={{ textAlign: 'center', color: '#00182b', fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.7rem', paddingTop: '3.5rem' }}>Professional Validation Pricing</h2>
          <p style={{ textAlign: 'center', color: '#01426A', fontSize: '1.18rem', marginBottom: '2.2rem', fontWeight: 500 }}>Competitive pricing for food safety validation services. Discounts available for multiple units and annual contracts.</p>
          <div className="service-cards pricing-cards">
            {/* Metal Detector */}
            <div className="card" style={{
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid #e0e7ef',
              borderRadius: '18px',
              boxShadow: '0 2px 12px rgba(1,66,106,0.08)',
              padding: '2.2rem 2.2rem',
              color: '#01426A',
              fontSize: '1.18rem',
              fontWeight: 500,
              minWidth: '420px',
              minHeight: '420px',
              maxWidth: '480px',
              maxHeight: '480px',
              width: '100%',
              aspectRatio: '1 / 1',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              transition: 'box-shadow 0.25s, transform 0.18s',
              justifyContent: 'center',
            }}>
              <h3 style={{ color: '#01426A', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', width: '100%' }}>Metal Detector Validation</h3>
              <div style={{ color: '#16A34A', fontSize: '3rem', fontWeight: 800, marginBottom: '0.0rem', textAlign: 'center', width: '100%' }}>$650</div>
            <div style={{ color: '#01426A', fontSize: '1.08rem', fontWeight: 700, textAlign: 'center', width: '100%', marginBottom: '0.08rem', marginTop: '-0.2rem' }}>First unit</div>
            <div style={{ color: '#01426A', fontSize: '0.98rem', fontWeight: 500, textAlign: 'center', width: '100%', marginBottom: '0.08rem' }}>+$250 per additional unit</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', textAlign: 'left', width: '100%', fontSize: '0.89rem' }}>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Sensitivity testing with Fe/NFe/SS test samples</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Full audit-ready report</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Same-day discount for multiple units</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Professional validation documentation</li>
              </ul>
            </div>
            {/* X-ray System */}
            <div className="card" style={{
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid #e0e7ef',
              borderRadius: '18px',
              boxShadow: '0 2px 12px rgba(1,66,106,0.08)',
              padding: '2.2rem 2.2rem',
              color: '#01426A',
              fontSize: '1.18rem',
              fontWeight: 500,
              minWidth: '420px',
              minHeight: '420px',
              maxWidth: '480px',
              maxHeight: '480px',
              width: '100%',
              aspectRatio: '1 / 1',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              transition: 'box-shadow 0.25s, transform 0.18s',
              justifyContent: 'center',
            }}>
              <h3 style={{ color: '#01426A', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', width: '100%' }}>X-ray System Validation</h3>
              <div style={{ color: '#16A34A', fontSize: '3rem', fontWeight: 800, marginBottom: '0.08rem', textAlign: 'center', width: '100%' }}>$700</div>
              <div style={{ color: '#01426A', fontSize: '1.08rem', fontWeight: 700, textAlign: 'center', width: '100%', marginBottom: '0.08rem', marginTop: '-0.08rem' }}>First unit</div>
           
            <div style={{ color: '#01426A', fontSize: '0.98rem', fontWeight: 500, textAlign: 'center', width: '100%', marginBottom: '0.08rem' }}>+$300 per additional unit</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', textAlign: 'left', width: '100%', fontSize: '0.89rem' }}>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Detectability testing using certified contaminants</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Traceable documentation</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Discounted rate for multiple systems</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Comprehensive validation report</li>
              </ul>
            </div>
            {/* Magnet */}
            <div className="card" style={{
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid #e0e7ef',
              borderRadius: '18px',
              boxShadow: '0 2px 12px rgba(1,66,106,0.08)',
              padding: '2.2rem 2.2rem',
              color: '#01426A',
              fontSize: '1.18rem',
              fontWeight: 500,
              minWidth: '420px',
              minHeight: '420px',
              maxWidth: '480px',
              maxHeight: '480px',
              width: '100%',
              aspectRatio: '1 / 1',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              transition: 'box-shadow 0.25s, transform 0.18s',
              justifyContent: 'center',
            }}>
              <h3 style={{ color: '#01426A', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', width: '100%' }}>Magnet Validation</h3>
              <div style={{ color: '#16A34A', fontSize: '3rem', fontWeight: 800, marginBottom: '0.08rem', textAlign: 'center', width: '100%' }}>$350</div>
              <div style={{ color: '#01426A', fontSize: '1.08rem', fontWeight: 700, textAlign: 'center', width: '100%', marginBottom: '0.08rem', marginTop: '-0.08rem' }}>First unit</div>
                          <div style={{ color: '#01426A', fontSize: '0.98rem', fontWeight: 500, textAlign: 'center', width: '100%', marginBottom: '0.08rem' }}>+$150 per additional unit</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', textAlign: 'left', width: '100%', fontSize: '0.89rem' }}>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Visual inspection</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Magnetic strength test</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Capture efficiency test</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Full detailed report</li>
              </ul>
            </div>
            {/* Temperature Mapping */}
            <div className="card" style={{
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid #e0e7ef',
              borderRadius: '18px',
              boxShadow: '0 2px 12px rgba(1,66,106,0.08)',
              padding: '2.2rem 2.2rem',
              color: '#01426A',
              fontSize: '1.18rem',
              fontWeight: 500,
              minWidth: '420px',
              minHeight: '420px',
              maxWidth: '480px',
              maxHeight: '480px',
              width: '100%',
              aspectRatio: '1 / 1',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              transition: 'box-shadow 0.25s, transform 0.18s',
              justifyContent: 'center',
            }}>
              <h3 style={{ color: '#01426A', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', width: '100%' }}>Temperature Mapping</h3>
              <div style={{ color: '#16A34A', fontSize: '3rem', fontWeight: 800, marginBottom: '0.08rem', textAlign: 'center', width: '100%' }}>$1200</div>
              <div style={{ color: '#01426A', fontSize: '1.08rem', fontWeight: 700, textAlign: 'center', width: '100%', marginBottom: '0.08rem', marginTop: '-0.08rem' }}>First unit</div>
              <div style={{ color: '#01426A', fontSize: '0.98rem', fontWeight: 500, textAlign: 'center', width: '100%', marginBottom: '0.08rem' }}>Request Quote</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', textAlign: 'left', width: '100%', fontSize: '0.89rem' }}>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Full comprehensive report</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Validated loggers</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>+$75 per additional logger (up to 16 total)</li>
                <li><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>Custom quotes for Oven and Freezer mapping</li>
              </ul>
            </div>
          </div>
          {/* Annual Service Contracts */}
          <div style={{ maxWidth: '900px', margin: '0 auto', marginTop: '2.5rem' }}>
            <h3 style={{ color: '#01426A', fontSize: '1.35rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.2rem' }}>Annual Service Contracts <span style={{ color: '#16A34A', fontWeight: 800 }}>(Best Value)</span></h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
              <div style={{ background: '#eaf3fa', borderRadius: '10px', padding: '1.1rem 1.7rem', minWidth: '200px', textAlign: 'center', border: '1.5px solid #cfe2f3' }}>
                <div style={{ color: '#16A34A', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>5% Off</div>
                <div style={{ color: '#01426A', fontWeight: 700, fontSize: '1.08rem' }}>2 Visits / Year</div>
                <div style={{ color: '#01426A', fontSize: '0.98rem', marginTop: '0.2rem' }}>Bi-annual visits with audit documentation</div>
              </div>
              <div style={{ background: '#eaf3fa', borderRadius: '10px', padding: '1.1rem 1.7rem', minWidth: '200px', textAlign: 'center', border: '1.5px solid #cfe2f3' }}>
                <div style={{ color: '#16A34A', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>10% Off</div>
                <div style={{ color: '#01426A', fontWeight: 700, fontSize: '1.08rem' }}>Quarterly Visits</div>
                <div style={{ color: '#01426A', fontSize: '0.98rem', marginTop: '0.2rem' }}>Enhanced compliance and performance tracking</div>
              </div>
              <div style={{ background: '#eaf3fa', borderRadius: '10px', padding: '1.1rem 1.7rem', minWidth: '200px', textAlign: 'center', border: '1.5px solid #cfe2f3' }}>
                <div style={{ color: '#16A34A', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>20% Off</div>
                <div style={{ color: '#01426A', fontWeight: 700, fontSize: '1.08rem' }}>Monthly Visits</div>
                <div style={{ color: '#01426A', fontSize: '0.98rem', marginTop: '0.2rem' }}>High-risk or high-audit environments</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
  <section id="why-us" className="why-us" style={{ background: '#f7fafc', margin: '0 auto', maxWidth: '100vw' }}>
          <h2>Why Choose Wheeler Food Safety Service?</h2>
          <p style={{ textAlign: 'center', color: '#01426A', fontSize: '1.18rem', marginBottom: '2.2rem', fontWeight: 500 }}>
            At Wheeler Food Safety Service, we make food safety simple, reliable, and audit-ready. Our third-party validation and calibration services keep your equipment performing at its best—so you can run your business with confidence.
          </p>
          <div style={{ maxWidth: '700px', margin: '0 auto 2rem auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="card" style={{ background: '#fff', border: '1.5px solid #e0e7ef', borderRadius: '12px', boxShadow: '0 2px 8px rgba(1,66,106,0.04)', padding: '1.2rem 1.5rem', color: '#16A34A', fontSize: '1.08rem', fontWeight: 500, transition: 'box-shadow 0.25s, transform 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)'; e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(1,66,106,0.04)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div><strong style={{ color: '#01426A', fontSize: '1.12rem' }}>Specialized Expertise</strong> – Focused on metal detectors, X-ray systems, magnets, and temperature devices</div>
                <div><strong style={{ color: '#01426A', fontSize: '1.12rem' }}>Independent &amp; Audit-Ready</strong> – Unbiased results with clear documentation for FDA, USDA, and GFSI compliance</div>
                <div><strong style={{ color: '#01426A', fontSize: '1.12rem' }}>Local &amp; Responsive</strong> – Utah-based service that minimizes downtime and keeps production moving</div>
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#01426A', fontSize: '1.18rem', marginBottom: '2.2rem', fontWeight: 500 }}>
            With Wheeler Food Safety Service, you gain more than compliance—you gain a trusted partner dedicated to protecting your products, your customers, and your brand.
          </p>
          <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', border: '1.5px solid #e0e7ef', borderRadius: '12px', boxShadow: '0 2px 8px rgba(1,66,106,0.04)', padding: '1.2rem 1.5rem', transition: 'box-shadow 0.25s, transform 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)'; e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(1,66,106,0.04)'; e.currentTarget.style.transform = 'none'; }}
          >
            <h3 style={{ color: '#01426A', fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 700 }}>Our Core Values:</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, color: '#2d6a4f', fontSize: '1.08rem', fontWeight: 500 }}>
              <li style={{ marginBottom: '0.7rem' }}><strong style={{ color: '#01426A' }}>Trust</strong> – Certified and reliable service</li>
              <li style={{ marginBottom: '0.7rem' }}><strong style={{ color: '#01426A' }}>Compliance</strong> – Confidence in meeting industry regulations</li>
              <li style={{ marginBottom: '0.7rem' }}><strong style={{ color: '#01426A' }}>Accuracy</strong> – Precise, consistent, and defensible results</li>
              <li><strong style={{ color: '#01426A' }}>Expertise</strong> – Skilled professionals with food safety focus</li>
            </ul>
          </div>
        </section>

        {/* Contact Section */}
  <section id="contact" className="contact" style={{ background: '#fff' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00182b', marginBottom: '1.2rem' }}>Contact Us</h2>
          <form id="contactForm" onSubmit={handleSubmit} autoComplete="off">
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <input type="text" id="name" name="name" placeholder="Name" required aria-label="Name" style={{ flex: 1 }} />
              <input type="email" id="email" name="email" placeholder="Email" required aria-label="Email" style={{ flex: 1 }} />
            </div>
            <textarea id="message" name="message" placeholder="Tell us how we can help you ..." required aria-label="Message" style={{ width: '100%' }}></textarea>
            <button type="submit" className="btn contact-submit-btn" disabled={contactLoading}>
              {contactLoading ? 'Sending...' : 'Submit'}
            </button>
          </form>
          {contactStatus && <p style={{ marginTop: '1rem', color: contactStatus.startsWith('Thank') ? 'green' : 'red' }}>{contactStatus}</p>}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-dark">
        <div className="footer-columns">
          <div>
            <strong>Wheeler Food Safety Services</strong><br />
            <span style={{ color: '#cfd8e3' }}>
              Professional food safety validation services<br />
              for Utah food manufacturers and related industries.
            </span>
          </div>
          <div>
            <strong>Services</strong><br />
            <span style={{ color: '#cfd8e3' }}>Metal Detector Validation<br />
            X-ray System Validation<br />
            Magnet Validation<br />
            Temperature Mapping</span>
          </div>
          <div>
            <strong>Contact</strong><br />
            <a href="mailto:Jordan@wheelerfs.com">Jordan@wheelerfs.com</a><br />
            <a href="tel:8019718838">(801) 971-8838</a><br />
            <a href="https://www.wheelerfs.com" target="_blank" rel="noopener noreferrer">www.wheelerfs.com</a><br />
            <span style={{ color: '#cfd8e3' }}>541 W 9560 S Sandy, UT 84070</span>
          </div>
        </div>
        <div className="footer-divider"></div>
        <p className="footer-copyright">© 2025 Wheeler Food Safety Service. A Meldrum Company.</p>
      </footer>
    </>
  );
};

export default App;
