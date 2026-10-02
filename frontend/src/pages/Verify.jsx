import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePageMeta from '../usePageMeta';
import { supabase, formatDay, daysUntil } from '../supabase';

// Public page the QR code on each certificate points to: /verify/?c=<code>.
// Shows only enough to prove the paper is genuine (no customer name or results).
const Verify = () => {
  usePageMeta({ title: 'Verify a certificate | Wheeler Food Safety', description: 'Confirm a Wheeler Food Safety certificate is genuine.' });
  const [params] = useSearchParams();
  const code = (params.get('c') || '').trim();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    if (code.length < 16) { setState({ loading: false, cert: null }); return; }
    let cancelled = false;
    setState({ loading: true });
    supabase.rpc('verify_certificate', { code }).then(({ data, error }) => {
      if (cancelled) return;
      setState(error ? { loading: false, error: true } : { loading: false, cert: data?.[0] || null });
    });
    return () => { cancelled = true; };
  }, [code]);

  const { loading, error, cert } = state;
  const due = cert && daysUntil(cert.next_due);
  const statusText = cert && (cert.status === 'revoked' ? 'Revoked'
    : cert.status === 'superseded' ? 'Superseded by a newer certificate'
    : due !== null && due < 0 ? 'Genuine. Validation is past due' : 'Genuine and current');
  const tone = cert && (cert.status === 'revoked' ? 'bad' : cert.status === 'superseded' || due < 0 ? 'warn' : 'good');

  return (
    <main className="content-page portal">
      <h1>Certificate verification</h1>
      {loading && <p className="content-intro">Checking certificate…</p>}
      {!loading && error && (
        <div className="verify-card warn"><p>We couldn't reach the certificate records just now. Please try again in a minute, or call 385-201-5609.</p></div>
      )}
      {!loading && !error && !cert && (
        <div className="verify-card bad">
          <h2>Certificate not found</h2>
          <p>This code doesn't match a certificate issued by Wheeler Food Safety Service. If you scanned it from a certificate, please contact us at 385-201-5609 or <a href="mailto:jordan@wheelerfs.com">jordan@wheelerfs.com</a>.</p>
        </div>
      )}
      {cert && (
        <div className={`verify-card ${tone}`}>
          <p className="verify-status">{tone === 'good' ? '✓ ' : tone === 'bad' ? '✗ ' : '! '}{statusText}</p>
          <dl className="verify-facts">
            <dt>Certificate No.</dt><dd>{cert.cert_no}</dd>
            <dt>Issued by</dt><dd>Wheeler Food Safety Service LLC</dd>
            <dt>Validation date</dt><dd>{formatDay(cert.validation_date)}</dd>
            {cert.next_due && <><dt>Next validation due</dt><dd>{formatDay(cert.next_due)}</dd></>}
            <dt>Equipment</dt><dd>{[cert.manufacturer, cert.model].filter(Boolean).join(' ') || '—'}</dd>
            <dt>Serial #</dt><dd>{cert.serial || '—'}</dd>
          </dl>
          <p className="verify-note">Check that the certificate number and serial number above match the paper certificate. Customers can sign in to the <Link to="/portal">customer portal</Link> to download the full certificate.</p>
        </div>
      )}
    </main>
  );
};

export default Verify;
