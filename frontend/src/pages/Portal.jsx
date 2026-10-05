import { useEffect, useMemo, useState } from 'react';
import usePageMeta from '../usePageMeta';
import { supabase, formatDay, daysUntil } from '../supabase';

const DUE_SOON_DAYS = 30;
const TYPE_LABELS = { md: 'Metal detector', xr: 'X-ray', mg: 'Magnet' };

function DueBadge({ iso }) {
  const d = daysUntil(iso);
  if (d === null) return null;
  if (d < 0) return <span className="badge bad">Overdue</span>;
  if (d <= DUE_SOON_DAYS) return <span className="badge warn">Due in {d} day{d === 1 ? '' : 's'}</span>;
  return <span className="badge good">Current</span>;
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/portal/` },
    });
    setBusy(false);
    if (error) setError(error.status === 429 ? 'Too many requests. Please wait a minute and try again.' : 'Something went wrong sending the link. Please try again.');
    else setSent(true);
  };

  if (sent) {
    return (
      <div className="portal-card">
        <h2>Check your email</h2>
        <p>We sent a sign-in link to <strong>{email}</strong>. Open it on this device or any other to see your certificates. The link works once and expires after an hour.</p>
        <button type="button" className="link-button" onClick={() => setSent(false)}>Use a different email</button>
      </div>
    );
  }
  return (
    <form className="portal-card" onSubmit={submit}>
      <h2>Sign in</h2>
      <p>Enter your work email and we'll send you a sign-in link. No password needed.</p>
      <label htmlFor="portal-email">Work email</label>
      <input id="portal-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p className="portal-error">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Email me a sign-in link'}</button>
    </form>
  );
}

function Certificates({ session }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState('');

  useEffect(() => {
    supabase
      .from('certificates')
      .select('id, cert_no, validation_date, next_due, manufacturer, model, serial, asset_id, as_left, status, pdf_path, cert_type:data->>certType, customers(name)')
      .order('validation_date', { ascending: false })
      .order('cert_no', { ascending: false })
      .then(({ data, error }) => (error ? setError('Could not load your certificates. Please refresh the page.') : setRows(data)));
  }, []);

  // Group by company; within a company the newest valid certificate per serial
  // number is the one whose due date matters.
  const groups = useMemo(() => {
    const map = new Map();
    for (const r of rows || []) {
      const name = r.customers?.name || 'Your company';
      if (!map.has(name)) map.set(name, { name, rows: [], latest: new Set(), seen: new Set() });
      const g = map.get(name);
      g.rows.push(r);
      const key = r.serial || r.id;
      if (r.status === 'valid' && !g.seen.has(key)) { g.seen.add(key); g.latest.add(r.id); }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const download = async (r) => {
    setDownloading(r.id);
    const { data, error } = await supabase.storage.from('certificates').createSignedUrl(r.pdf_path, 60, { download: `${r.cert_no}.pdf` });
    setDownloading('');
    if (error) return alert('Sorry, that PDF could not be downloaded. Please contact us.');
    window.location.href = data.signedUrl;
  };

  return (
    <>
      <div className="portal-bar">
        <span>Signed in as <strong>{session.user.email}</strong></span>
        <button type="button" className="link-button" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      {error && <p className="portal-error">{error}</p>}
      {!rows && !error && <p>Loading certificates…</p>}
      {rows && rows.length === 0 && (
        <div className="portal-card">
          <h2>No certificates yet</h2>
          <p>Your email isn't linked to a company in our records yet, or no certificates have been issued. Contact us at <a href="mailto:support@wheelerfs.com">support@wheelerfs.com</a> or 385-201-5609 to get access.</p>
        </div>
      )}
      {groups.map((g) => (
        <section key={g.name} className="portal-group">
          <h2>{g.name}</h2>
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr><th>Certificate</th><th>Equipment</th><th>Validated</th><th>Next due</th><th></th></tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.id} className={r.status !== 'valid' ? 'muted' : ''}>
                    <td data-label="Certificate">{r.cert_no}{r.status !== 'valid' && <span className="badge">{r.status === 'superseded' ? 'Superseded' : 'Revoked'}</span>}</td>
                    <td data-label="Equipment">
                      <small className="equip-type">{TYPE_LABELS[r.cert_type] || TYPE_LABELS.md}</small>
                      {[r.manufacturer, r.model].filter((v) => v && v !== 'N/A').join(' ')}
                      <small>{[r.asset_id, r.serial && `S/N ${r.serial}`].filter(Boolean).join(' · ')}</small>
                    </td>
                    <td data-label="Validated">{formatDay(r.validation_date)}</td>
                    <td data-label="Next due">{formatDay(r.next_due)} {g.latest.has(r.id) && <DueBadge iso={r.next_due} />}</td>
                    <td>
                      {r.pdf_path && (
                        <button type="button" className="btn btn-small" onClick={() => download(r)} disabled={downloading === r.id}>
                          {downloading === r.id ? 'Preparing…' : 'Download PDF'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

const Portal = () => {
  usePageMeta({ title: 'Customer portal | Wheeler Food Safety', description: 'Download your validation certificates.' });
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <main className="content-page portal">
      <h1>Customer portal</h1>
      <p className="content-intro">Your validation certificates and upcoming due dates, available any time for audits.</p>
      {session === undefined ? <p>Loading…</p> : session ? <Certificates session={session} /> : <SignIn />}
    </main>
  );
};

export default Portal;
