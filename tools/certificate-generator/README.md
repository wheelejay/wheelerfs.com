# Certificate generator

A single-file tool for producing Wheeler Food Safety validation certificates for
metal detectors, X-ray inspection systems and magnets (pull test). Open `index.html` in Chrome or Edge on your computer; it works
offline and does not need the website or any server.

This folder is not part of the deployed website (the deploy workflow only
publishes `frontend/`), and no customer data is stored in this repository.

## Using it

1. Pick the **Certificate type** at the top, then fill in the form on the left; the certificate
   preview on the right updates as you type. Numbers are per type: `WFS-MD-…`, `WFS-XR-…`, `WFS-MG-…`.
   * **X-ray:** same test points as metal detectors, plus optional contaminant standards
     (glass, ceramic, calcified bone, …) with **+ Add contaminant**.
   * **Magnet:** set the number of tubes (up to 24) and test points per tube (up to 8), enter
     each pull reading in lbs. A tube passes only if *every* reading meets the minimum pull;
     the certificate shows each tube's minimum and average.
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
