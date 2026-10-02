# Certificate portal: Supabase setup

The customer portal (`/portal`), the QR verify page (`/verify`) and the
generator's **Publish to portal** button all use the Supabase project
`dckhemtjpwltdpmxjouq`.

## One-time setup

1. **Database:** Supabase → SQL Editor → New query → paste all of `setup.sql` → Run.
   It is safe to run again after changes.
2. **Your admin login (for the generator):** Authentication → Users → Add user →
   Create new user. Email `jordan@wheelerfs.com`, choose a password, tick
   *Auto Confirm User*. That email is the admin listed at the bottom of `setup.sql`.
3. **Sign-in links for customers:** Authentication → URL Configuration:
   * Site URL: `https://wheelerfs.com`
   * Redirect URLs: add `https://wheelerfs.com/portal/` and `http://localhost:5173/portal/`

## Updating the database

When `setup.sql` changes (for example when the admin page was added), paste the
whole file into the SQL Editor and run it again. It only adds what is missing
and keeps all existing data.

## Admin page

`wheelerfs.com/admin` is the certificate generator in online mode: sign in with
the admin email and password, and customers, equipment, settings and
certificate numbers are stored in the `customers`, `equipment`, `app_settings`
and `cert_counters` tables instead of one browser. To move over from the
offline generator, export a backup there and use Settings → Import backup on
the admin page.

## Giving a customer access

In the generator: **Publish to portal** → *Who can see this customer's
certificates* → add their email. They then go to `wheelerfs.com/portal`, enter
that email, and click the link they receive.

## Keys

The URL and *publishable* key in the code are public by design; what they can
do is limited by the row level security rules in `setup.sql`. Never put the
*secret* / *service_role* key or the database password in this repository.

## Email limits

Supabase's built-in email sender is limited to a few sign-in emails per hour
and is meant for getting started. Before inviting many customers, set up
custom SMTP (Authentication → Emails → SMTP settings), e.g. with the Resend
account the contact form already uses.
