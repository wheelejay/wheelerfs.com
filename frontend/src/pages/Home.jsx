import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../usePageMeta';
import { REVIEW_URL } from '../siteInfo';

const Home = () => {
  usePageMeta({
    title: 'Food Safety Validation Services in Utah | Wheeler Food Safety',
    description: 'Independent metal detector, X-ray, magnet, and temperature mapping validation for Utah food manufacturers. Audit-ready reports for FDA, USDA, and GFSI.',
  });

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
    try {
      const res = await fetch('https://wheelerfs-com-1.onrender.com/api/contact', {
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

  // Dynamic data for service cards
  const serviceCards = [
    {
      slug: 'metal-detector-validation',
      icon: '/icons/shield.png',
      alt: 'Metal Detector Shield Icon',
      title: 'Metal Detector Validation',
      desc: 'Sensitivity testing with Fe/NFe/SS test samples and full audit-ready reports.'
    },
    {
      slug: 'x-ray-system-validation',
      icon: '/icons/magglass.png',
      alt: 'X-ray Magnifying Glass Icon',
      title: 'X-ray System Validation',
      desc: 'Detectability testing using certified contaminants with traceable documentation.'
    },
    {
      slug: 'magnet-validation',
      icon: '/icons/magnet.png',
      alt: 'Magnet Icon',
      title: 'Magnet Validation',
      desc: 'Visual inspection, magnetic strength testing, and capture efficiency analysis.'
    },
    {
      slug: 'temperature-mapping',
      icon: '/icons/thermometer.png',
      alt: 'Thermometer Icon',
      title: 'Temperature Mapping',
      desc: 'Comprehensive temperature mapping for ambient/cold rooms and high temperature with validated loggers.'
    }
  ];

  const pricingCards = [
    {
      title: 'Metal Detector Validation',
      price: '$650',
      sub: 'First unit',
      add: '+$250 per additional unit',
      features: [
        'Sensitivity testing with Fe/NFe/SS test samples',
        'Full audit-ready report',
        'Same-day discount for multiple units',
        'Professional validation documentation'
      ]
    },
    {
      title: 'X-ray System Validation',
      price: '$700',
      sub: 'First unit',
      add: '+$300 per additional unit',
      features: [
        'Detectability testing using certified contaminants',
        'Traceable documentation',
        'Discounted rate for multiple systems',
        'Comprehensive validation report'
      ]
    },
    {
      title: 'Magnet Validation',
      price: '$350',
      sub: 'First unit',
      add: '+$150 per additional unit',
      features: [
        'Visual inspection',
        'Magnetic strength test',
        'Capture efficiency test',
        'Full detailed report'
      ]
    },
    {
      title: 'Temperature Mapping',
      price: '$1200',
      sub: 'First unit',
      add: 'Request Quote',
      features: [
        'Full comprehensive report',
        'Validated loggers',
        '+$75 per additional logger (up to 16 total)',
        'Custom quotes for Oven and Freezer mapping'
      ]
    }
  ];

  return (
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
            {serviceCards.map(card => (
              <Link to={`/services/${card.slug}`} className="card service-card" key={card.title}>
                <img src={card.icon} alt={card.alt} className="service-card-icon" />
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="service-card-more">Learn more →</span>
              </Link>
            ))}
          </div>
        </section>

         {/* Pricing Section (moved below services, card style updated) */}
  <section id="pricing" className="pricing-section" style={{ background: '#fff', padding: '6.5rem 0 2.5rem 0', borderBottom: '1.5px solid #e0e7ef' }}>
          <h2 style={{ textAlign: 'center', color: '#00182b', fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.7rem', paddingTop: '3.5rem' }}>Professional Validation Pricing</h2>
          <p style={{ textAlign: 'center', color: '#01426A', fontSize: '1.18rem', marginBottom: '2.2rem', fontWeight: 500 }}>Competitive pricing for food safety validation services. Discounts available for multiple units and annual contracts.</p>
          <div className="service-cards pricing-cards">
            {pricingCards.map(card => (
              <div className="card" key={card.title} style={{
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
                <h3 style={{ color: '#01426A', fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', width: '100%' }}>{card.title}</h3>
                <div style={{ color: '#16A34A', fontSize: '3rem', fontWeight: 800, marginBottom: '0.0rem', textAlign: 'center', width: '100%' }}>{card.price}</div>
                <div style={{ color: '#01426A', fontSize: '1.08rem', fontWeight: 700, textAlign: 'center', width: '100%', marginBottom: '0.08rem', marginTop: '-0.2rem' }}>{card.sub}</div>
                <div style={{ color: '#01426A', fontSize: '0.98rem', fontWeight: 500, textAlign: 'center', width: '100%', marginBottom: '0.08rem' }}>{card.add}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', textAlign: 'left', width: '100%', fontSize: '0.89rem' }}>
                  {card.features.map((feature, i) => (
                    <li key={i}><span style={{ color: '#16A34A', fontWeight: 700, marginRight: '0.5em' }}>✔</span>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
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

          <div className="review-cta">
            <img src="/review-qr.svg" alt="QR code to leave a Google review" className="review-qr" width="120" height="120" />
            <div>
              <h3>Worked with us?</h3>
              <p>We'd appreciate a quick Google review. It helps other Utah food manufacturers find us.</p>
              <a href={REVIEW_URL} className="btn" target="_blank" rel="noopener noreferrer">★ Leave a Google review</a>
            </div>
          </div>
        </section>
      </main>
  );
};

export default Home;
