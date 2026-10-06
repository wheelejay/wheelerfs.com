import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../siteInfo';

const STORAGE_KEY = 'wfs-chat';
const MAX_TURNS = 30; // must match the backend
const GREETING =
  "Hi! I'm the Wheeler Food Safety assistant. I can answer questions about our validation services and pricing, or pass your details to Jordan for a quote.";
const SUGGESTIONS = [
  'How much is metal detector validation?',
  'How often should equipment be validated?',
  'I’d like a quote',
];

function loadHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage blocked (private browsing); the chat still works for this page view
  }
}

// Turn URLs into links. wheelerfs.com links stay inside the site so the chat
// stays open while the visitor looks at the page.
function Linkified({ text }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) => {
    if (!/^https?:\/\//.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
    const url = part.replace(/[.,;:!?]+$/, '');
    const trailing = part.slice(url.length);
    const internal = url.match(/^https?:\/\/(?:www\.)?wheelerfs\.com(\/.*)?$/);
    const link = internal ? (
      <Link to={internal[1] || '/'}>{url.replace(/^https?:\/\/(?:www\.)?/, '')}</Link>
    ) : (
      <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
    );
    return (
      <React.Fragment key={i}>
        {link}
        {trailing}
      </React.Fragment>
    );
  });
}

const ChatWidget = () => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(loadHistory);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [slow, setSlow] = React.useState(false);
  const [error, setError] = React.useState('');
  const listRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const warmed = React.useRef(false);

  React.useEffect(() => saveHistory(items), [items]);

  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    // The backend sleeps when idle; start waking it as soon as the chat opens
    if (!warmed.current) {
      warmed.current = true;
      fetch(`${API_BASE}/`).catch(() => {});
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [items, sending, error, open]);

  const atLimit = items.length >= MAX_TURNS - 1;

  async function send(text) {
    const content = text.trim();
    if (!content || sending || atLimit) return;
    const history = [...items, { role: 'user', content }];
    setItems(history);
    setInput('');
    setError('');
    setSending(true);
    const slowTimer = setTimeout(() => setSlow(true), 6000);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || 'The assistant is unavailable right now.');
      setItems([...history, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      // Take the unanswered message back out so the conversation stays valid
      setItems(items);
      setInput(content);
      setError(
        err instanceof TypeError
          ? "Couldn't reach the assistant. Check your connection, or call (385) 201-5609."
          : err.message,
      );
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
      setSending(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function restart() {
    setItems([]);
    setError('');
    setInput('');
  }

  return (
    <>
      {open && (
        <section className="chat-panel" role="dialog" aria-label="Chat with the Wheeler Food Safety assistant">
          <div className="chat-header">
            <div>
              <strong>Wheeler Food Safety</strong>
              <span>AI assistant</span>
            </div>
            <div className="chat-header-actions">
              {items.length > 0 && (
                <button type="button" onClick={restart} className="chat-text-btn">New chat</button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="chat-close" aria-label="Close chat">×</button>
            </div>
          </div>

          <div
            className="chat-messages"
            ref={listRef}
            aria-live="polite"
            onClick={(e) => {
              // On phones the panel covers the page, so close it when a link is tapped
              if (e.target.closest('a') && window.matchMedia('(max-width: 640px)').matches) setOpen(false);
            }}
          >
            <div className="chat-msg assistant">{GREETING}</div>
            {items.length === 0 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button type="button" key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            {items.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.role === 'assistant' ? <Linkified text={m.content} /> : m.content}
              </div>
            ))}
            {sending && (
              <div className="chat-msg assistant chat-typing" aria-label="Assistant is typing">
                <span /><span /><span />
                {slow && <em>Waking up the assistant, this can take up to a minute…</em>}
              </div>
            )}
            {error && <div className="chat-error" role="alert">{error}</div>}
            {atLimit && (
              <div className="chat-error">This chat has reached its length limit. Start a new chat, call (385) 201-5609, or use the <Link to="/#contact">contact form</Link>.</div>
            )}
          </div>

          <form className="chat-input" onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your question…"
              aria-label="Your message"
              disabled={atLimit}
            />
            <button type="submit" disabled={sending || !input.trim() || atLimit} aria-label="Send">➤</button>
          </form>
          <p className="chat-disclaimer">AI can make mistakes. Jordan confirms every quote.</p>
        </section>
      )}

      <button
        type="button"
        className={`chat-launcher${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with us'}
        aria-expanded={open}
      >
        {open ? '×' : (
          <>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            </svg>
            <span className="chat-launcher-label">Questions? Chat with us</span>
          </>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
