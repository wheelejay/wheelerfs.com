require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { Resend } = require('resend');
const { registerChat } = require('./chat');

const app = express();

// Render provides the port in an environment variable
const PORT = process.env.PORT || 3001;

// Allow CORS from your live frontend (GitHub Pages)
const allowedOrigins = [
  'https://wheelerfs.com',
  'https://www.wheelerfs.com',
  'http://localhost:5173' // optional for local testing with Vite
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

// Render sits behind a proxy; use the visitor's real IP for rate limits
app.set('trust proxy', 1);

app.use(express.json());

// Website chat assistant
registerChat(app);


// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Resend reports failures (e.g. an unverified sending domain) in `error`
    // instead of throwing, so check it explicitly.
    const { data, error } = await resend.emails.send({
      // Until wheelerfs.com is verified in Resend, use its shared test address
      // (which can only deliver to the Resend account owner's email).
      from: process.env.CONTACT_FROM || 'Wheeler Food Safety <onboarding@resend.dev>',
      to: process.env.CONTACT_TO || 'jordan@wheelerfs.com',
      replyTo: email,
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });
    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send message.' });
    }
    console.log('Resend response:', data);
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Basic health check endpoint (useful for Render)
app.get('/', (req, res) => {
  res.send('Backend is running successfully.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
