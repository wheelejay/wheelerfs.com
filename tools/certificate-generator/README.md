# Certificate generator

A single-file tool for producing Wheeler Food Safety metal detector validation
certificates. Open `index.html` in Chrome or Edge on your computer; it works
offline and does not need the website or any server.

This folder is not part of the deployed website (the deploy workflow only
publishes `frontend/`), and no customer data is stored in this repository.

## Using it

1. Fill in the form on the left; the certificate preview on the right updates as you type.
2. **Auto** next to Certificate No. assigns the next number for the validation date (`WFS-MD-YYMMDD-NN`).
3. **Save customer** / **Save detector** remember a customer's address and each of their detectors,
   so next visit you pick them from the dropdowns.
4. **Next detector, same visit** keeps the client, standards and dates, clears the equipment and
   results, and assigns the next certificate number.
5. **Print / Save PDF** → choose "Save as PDF" as the printer. Margins: None/Default, and make sure
   "Background graphics" is ticked. The file name defaults to the certificate number, customer and serial.
6. **Save job file** downloads the certificate's data so it can be reopened and corrected later.

## Where data lives

Customers, detectors, settings, the number counter and the current draft are kept in the
browser's local storage on that computer only. Use **Settings → Export backup** regularly, and
**Import backup** to move everything to another computer or browser.
