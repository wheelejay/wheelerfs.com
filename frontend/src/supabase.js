import { createClient } from '@supabase/supabase-js';

// The publishable key is meant to be public: it only allows what the database's
// row level security policies allow (see supabase/setup.sql). Never put the
// secret / service_role key here.
export const SUPABASE_URL = 'https://dckhemtjpwltdpmxjouq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EjnwXzqk_jyHS0lVvfRbAw_zMs6S6e2';

// "implicit" lets a customer request the sign-in link on one device and open it
// on another (e.g. ask on the office PC, click the email on their phone).
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { flowType: 'implicit', persistSession: true, detectSessionInUrl: true },
});

// "2026-08-27" → "Aug 27, 2026" without timezone shifts.
export function formatDay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d) - today) / 86400000);
}
