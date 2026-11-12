// Free downloads and guides shown on the Free Resources page (/resources/).
// Used by the React page and by the build's prerendered copy (plugins/content.js).
// To add a download: put the PDF in public/downloads/, a page-1 preview image in
// public/downloads/previews/ (same name, .jpg), and add an entry below.

export const RESOURCES_TITLE = 'Free Resources';
export const RESOURCES_INTRO =
  'Free, printable logs and plain-English guides for food and supplement plants. Copy them, use them on your lines, and share them with your team.';

export const downloads = [
  {
    file: 'wheeler-metal-detector-verification-log',
    title: 'Metal Detector Verification Log',
    description:
      'Record routine operator checks on a metal detector CCP: ferrous, non-ferrous, and stainless steel test pieces, reject bin, fail-safes, corrective actions, and QA sign-off.',
    pages: 'Page 1: the log. Page 2: how to run a metal detector check.',
    guide: 'metal-detector-verification-log',
    service: { slug: 'metal-detector-validation', label: 'Metal detector validation' },
  },
  {
    file: 'wheeler-x-ray-verification-log',
    title: 'X-Ray Inspection Verification Log',
    description:
      'The same checks for X-ray systems, with an extra column for glass, stone, or bone test pieces and a check that the right product program is running.',
    pages: 'Page 1: the log. Page 2: how to run an X-ray check.',
    service: { slug: 'x-ray-system-validation', label: 'X-ray system validation' },
  },
  {
    file: 'wheeler-magnet-inspection-log',
    title: 'Magnet Inspection & Cleaning Log',
    description:
      'Record the condition of each magnet, what it caught, cleaning, and re-installation, so you can spot equipment wear upstream before it becomes a problem.',
    pages: 'Page 1: the log. Page 2: how to inspect and clean magnets safely.',
    service: { slug: 'magnet-validation', label: 'Magnet validation' },
  },
];

// Blog posts listed under "Helpful guides". Each one appears once it's published.
export const guideSlugs = [
  'metal-detector-verification-log',
  'haccp-metal-detection-requirements',
  'metal-detector-test-piece-sizes',
  'how-often-validate-metal-detector',
  'metal-detector-failed-check',
  'metal-detector-calibration-vs-validation',
  'sqf-brcgs-metal-detection-requirements',
  'metal-detector-false-rejects',
  'magnet-pull-testing',
  'thermometer-calibration-food-plants',
  'what-to-expect-validation-day',
];

export const pdfUrl = (d) => `/downloads/${d.file}.pdf`;
export const previewUrl = (d) => `/downloads/previews/${d.file}.jpg`;
