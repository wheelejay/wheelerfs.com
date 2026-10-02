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

## Using it

1. Pick the **Certificate type** at the top, then fill in the form on the left; the certificate
   preview on the right updates as you type. Numbers are per type: `WFS-MD-…`, `WFS-XR-…`, `WFS-MG-…`.
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
