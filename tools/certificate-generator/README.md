# Certificate generator

A single-file tool for producing Wheeler Food Safety validation certificates for
metal detectors, X-ray inspection systems and magnets (pull test). Open `index.html` in Chrome or Edge on your computer; it works
offline and does not need the website or any server.

The same file is also published as **wheelerfs.com/admin** (the website build copies it
there). Opened from the website it shows a sign-in screen and stores customers, equipment,
settings and certificate numbers in Supabase, so they're the same on every device. Opened as
a file it keeps everything in that browser and works offline. No customer data is stored in
this repository.

**Offline on the admin page:** after signing in once with a connection, the page keeps a copy
of itself on the device (`sw.js`), so it opens with no signal. Customers, equipment, settings
and certificate numbers changed while offline are saved on the device and sent automatically
when the connection returns (the status button in the top bar shows what's waiting; click it to
sync now). Numbers taken offline continue from the device's last known number and are checked
against the server on sync. Publishing needs a connection.
With a connection the page always loads the newest version, and a tab left open shows **Reload now**
when a newer version goes live. Settings shows the version (deploy time) at the bottom.

**Records (admin page only):** the **Records** button opens three tabs:
* **Due dates:** each unit's latest valid certificate, sorted by next due date (overdue / 30 / 60 /
  90 days / everything). *New certificate* puts that customer and unit on the form.
* **Certificates:** search every published certificate; download the PDF, *Reopen* it on the form
  to correct and republish (same number and QR code), *Revoke* / *Restore*, or delete permanently.
  **Job PDF** combines every certificate from the same service order (or the same day when there's
  no service order) behind a branded summary page; **Email** opens a pre-written email in your mail
  program to the customer's portal contacts (attach the Job PDF and send).
* **Backup:** download a full backup (.json with customers, portal emails, equipment, settings,
  counters and every certificate's details) and a .zip of all PDFs, a folder per customer.

**Equipment labels:** **Label** in the top bar downloads a Brother P-touch label (`.lbx`, 24 mm tape ×
76.5 mm, PT-D610BT) for the certificate on the form: QR code to its verify page, next due month in
large type, PASS / FAIL / OUT OF SERVICE, certificate number, serial number (asset ID only when there's no serial), validation date and
tech initials. Open it in P-touch Editor and print; the text can still be edited there. On the admin
page, **Records → Certificates → Label** does the same for a published certificate, and **Job labels**
downloads one `.zip` with a label for every unit in that job. Works offline. The QR code only works
once the certificate is published.

**Billing (admin page only):** the **Certificates | Billing** switch in the top bar opens quotes
and invoices built from the same customer list. Pick items from the price list (Quotes &
invoices → Price list), set terms (Due on receipt / Net 15–60), tax rate or tax exempt, and
record payments; status (sent / part paid / overdue / paid) and the unpaid totals are worked
out automatically. Quotes convert to invoices in one click, and **Records → Certificates →
Invoice** starts an invoice for a whole job at the first-unit / additional-unit prices.
Print / Save PDF and Email work the same as for certificates. Payment instructions, card
link, quote terms and the footer address are in Settings.

## Using it

1. Pick the **Certificate type** at the top, then fill in the form on the left; the certificate
   preview on the right updates as you type. Numbers are per type: `WFS-MD-…`, `WFS-XR-…`, `WFS-MG-…`.
   * **Metal detector:** pick which non-ferrous metal you used (brass, aluminum, copper, or just
     "Non-Ferrous"), and use **+ Add standard** when a client wants more, for example both brass
     and aluminum. Each extra standard gets its own results column; ✕ removes it.
   * **X-ray:** same test points as metal detectors, plus optional contaminant standards
     (glass, ceramic, calcified bone, …) with **+ Add contaminant**.
   * **Magnet:** set the number of tubes (up to 24) and test points per tube (up to 8), enter
     each pull reading in lbs. A tube passes only if *every* reading meets the minimum pull;
     the certificate shows each tube's minimum and average.
   * **Test points and checks** (all types) are editable lists: type over a row to rename it,
     **+ Add test point** / **+ Add check** adds one (with suggestions), ✕ removes it.
     Settings → *Use current standards, test points & checks as default* saves your usual list
     per type, and **Save equipment** remembers each unit's own list.
2. **Auto** next to Certificate No. assigns the next number for the type and validation date (e.g. `WFS-MG-260527-01`) and a new QR code.
3. **Save customer** / **Save equipment** remember a customer's address and each of their units,
   so next visit you pick them from the dropdowns.
4. **Next unit, same visit** keeps the client, standards and dates, clears the equipment and
   results, and assigns the next certificate number.
5. **Print / Save PDF** → choose "Save as PDF" as the printer. Margins: None/Default, and make sure
   "Background graphics" is ticked. The file name defaults to the certificate number, customer and serial.
6. **Save job file** downloads the certificate's data so it can be reopened and corrected later.
7. **Publish to portal** (after saving the PDF): sign in with your Supabase admin login, choose the
   PDF you just saved, and click Publish. The certificate's QR code starts working and the customer
   can download it at wheelerfs.com/portal. The same window manages which emails can see each
   customer's certificates. See `supabase/README.md` for the one-time setup.

Each certificate gets its own random verification code, printed as a QR code linking to
`wheelerfs.com/verify/?c=…` (turn it off in Settings). The portal features need an internet
connection; everything else works offline.

## Where data lives

Customers, detectors, settings, the number counter and the current draft are kept in the
browser's local storage on that computer only. Use **Settings → Export backup** regularly, and
**Import backup** to move everything to another computer or browser.
