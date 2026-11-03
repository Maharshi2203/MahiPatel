import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Check, Copy, Loader2 } from 'lucide-react';
import { smoothScrollTo } from '../lib/motion';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const CONTACT_EMAIL = 'mahipatel1329@gmail.com';
/** Set by links elsewhere on the site (e.g. the footer) to land directly on the form. */
export const SCROLL_TO_FORM_KEY = 'mahi_scroll_to_contact_form';
export const CONTACT_FORM_ID = 'contact-form';

/**
 * Submissions are delivered by Web3Forms (https://web3forms.com) to the inbox the
 * access key was created for (mahipatel1329@gmail.com).
 *
 * Get a free key at https://web3forms.com → enter the email → the key arrives by
 * email. Paste it below, or set VITE_WEB3FORMS_ACCESS_KEY in a .env file.
 * The key is designed to be public: it can only send mail to that one inbox.
 */
const WEB3FORMS_ACCESS_KEY: string =
  (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env.VITE_WEB3FORMS_ACCESS_KEY ||
  '96b58fc6-48fd-4b63-8204-3ffe18ae7242';
const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
const FORM_CONFIGURED = /^[0-9a-f-]{36}$/i.test(WEB3FORMS_ACCESS_KEY);

const ENQUIRY_TYPES = ['Internship', 'Project Commission', 'Collaboration', 'Other'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 font-mono-code text-[11px] text-[#9A773E] uppercase tracking-[0.2em]">
    <span className="h-px w-8 bg-[#9A773E]" />
    <span>{children}</span>
  </div>
);

const inputClass =
  'w-full bg-transparent border-0 border-b border-[#D9D6CE] px-0 py-3 font-sans text-base text-[#141413] placeholder:text-[#B3AFA6] focus:outline-none focus:ring-0 transition-colors duration-500';

/** Label above, input below, with a gold underline that draws in on focus. */
const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="group block">
    <span className="block font-mono-code text-[10px] uppercase tracking-[0.18em] text-[#7A7770] transition-colors duration-500 group-focus-within:text-[#9A773E]">
      {label}
      {required && <span className="text-[#9A773E]"> *</span>}
    </span>
    <span className="relative block">
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-px origin-left scale-x-0 bg-[#9A773E] transition-transform duration-700 group-focus-within:scale-x-100"
      />
    </span>
  </label>
);

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onCursorChange }) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    enquiry: ENQUIRY_TYPES[0],
    location: '',
    message: '',
    honey: '',
  });

  const hover = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  // Arriving from a "Start a conversation" link → scroll straight to the form
  useEffect(() => {
    let wanted = false;
    try {
      wanted = sessionStorage.getItem(SCROLL_TO_FORM_KEY) === '1';
      sessionStorage.removeItem(SCROLL_TO_FORM_KEY);
    } catch {}
    if (!wanted) return;
    const t = setTimeout(() => smoothScrollTo(document.getElementById(CONTACT_FORM_ID)), 120);
    return () => clearTimeout(t);
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (form.honey) return setStatus('sent'); // bot filled the hidden field
    setStatus('sending');
    try {
      if (!FORM_CONFIGURED) throw new Error('Web3Forms access key is not set (see ContactPage.tsx).');
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New ${form.enquiry.toLowerCase()} enquiry from ${form.name} — Portfolio`,
          from_name: 'Mahi Patel Portfolio',
          replyto: form.email,
          botcheck: '',
          Name: form.name,
          Email: form.email,
          Phone: form.phone || '—',
          'Enquiry type': form.enquiry,
          'Company / project location': form.location || '—',
          Message: form.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || res.statusText);
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', enquiry: ENQUIRY_TYPES[0], location: '', message: '', honey: '' });
    } catch (err) {
      console.error('Contact form failed', err);
      setStatus('error');
    }
  };

  const mailtoFallback = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${form.enquiry} enquiry${form.name ? ` from ${form.name}` : ''}`
  )}&body=${encodeURIComponent(form.message)}`;

  return (
    <div id="contact-page" className="relative min-h-screen bg-[#FFFFFF] text-[#141413] pt-28 md:pt-32 pb-24">
      {/* Hero */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto">
        <Eyebrow>Contact</Eyebrow>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:items-end">
          <h1 className="md:col-span-8 font-display font-light text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Let’s create something
            <br />
            <span className="italic text-[#9A773E]">meaningful together.</span>
          </h1>
          <p className="md:col-span-4 text-base leading-relaxed text-[#55534D]">
            Whether it’s an internship, a new interior project or a creative collaboration, I’d love to hear about it.
            Share a few details and I’ll get back to you personally.
          </p>
        </div>
      </section>

      {/* Details + form */}
      <section data-reveal data-reveal-delay="120" className="px-6 md:px-14 max-w-6xl mx-auto mt-16 md:mt-20 pt-12 border-t border-[#E5E3DD] grid grid-cols-1 md:grid-cols-12 gap-14">
        <aside className="md:col-span-4 space-y-10">
          <div>
            <div className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">Email</div>
            <div className="mt-2 flex items-center gap-3">
              <a href={`mailto:${CONTACT_EMAIL}`} {...hover} className="text-[#141413] hover:text-[#9A773E] transition-colors break-all">
                {CONTACT_EMAIL}
              </a>
              <button
                onClick={copyEmail}
                onMouseEnter={() => onCursorChange?.('copy')}
                onMouseLeave={() => onCursorChange?.('default')}
                aria-label="Copy email address"
                className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-full border border-[#E5E3DD] text-[#7A7770] hover:border-[#9A773E] hover:text-[#9A773E] transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className={`mt-1 text-xs text-[#9A773E] transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>Copied to clipboard</div>
          </div>

          <div>
            <div className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">Based in</div>
            <div className="mt-2 text-[#141413]">Ahmedabad, Gujarat, India</div>
          </div>

          <div>
            <div className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">Availability</div>
            <div className="mt-2 flex items-center gap-2 text-[#141413]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#9A773E] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9A773E]" />
              </span>
              Open to internships & collaborations
            </div>
          </div>

          <div className="pt-8 border-t border-[#E5E3DD]">
            <div className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770] mb-5">How it works</div>
            <ol className="space-y-5">
              {[
                ['Share your brief', 'Tell me about the role, space or idea.'],
                ['Conversation', 'I’ll reply to discuss scope, timeline and fit.'],
                ['Design begins', 'From concept to drawings, together.'],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr]">
                  <span className="font-mono-code text-xs text-[#9A773E] pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-[#141413]">{t}</div>
                    <div className="text-sm text-[#6E6C65]">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div id={CONTACT_FORM_ID} className="md:col-span-8 scroll-mt-28">
          {status === 'sent' ? (
            <div className="page-enter border border-[#E5E3DD] bg-[#F8F8F6] p-10 md:p-14" role="status">
              <div className="h-12 w-12 rounded-full bg-[#141413] text-white inline-flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h2 className="mt-6 font-display font-light text-3xl md:text-4xl">Thank you — message received.</h2>
              <p className="mt-3 text-[#55534D] max-w-md">I’ll read it carefully and get back to you at the email you provided.</p>
              <button
                onClick={() => setStatus('idle')}
                {...hover}
                className="mt-8 text-sm text-[#141413] underline underline-offset-4 decoration-[#9A773E] hover:text-[#9A773E]"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="page-enter space-y-9">
              <div>
                <div className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770] mb-4">I’m reaching out about</div>
                <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Enquiry type">
                  {ENQUIRY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={form.enquiry === t}
                      onClick={() => setForm((f) => ({ ...f, enquiry: t }))}
                      {...hover}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        form.enquiry === t
                          ? 'bg-[#141413] border-[#141413] text-white'
                          : 'border-[#D9D6CE] text-[#55534D] hover:border-[#141413] hover:text-[#141413]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <Field label="Full name" required>
                  <input required name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={set('name')} className={inputClass} />
                </Field>
                <Field label="Email" required>
                  <input required type="email" name="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className={inputClass} />
                </Field>
                <Field label="Phone">
                  <input type="tel" name="phone" autoComplete="tel" placeholder="Optional" value={form.phone} onChange={set('phone')} className={inputClass} />
                </Field>
                <Field label="Company / project location">
                  <input name="location" placeholder="e.g. Ahmedabad studio, residence in Surat" value={form.location} onChange={set('location')} className={inputClass} />
                </Field>
              </div>

              <Field label="Message" required>
                <textarea
                  required
                  rows={5}
                  name="message"
                  placeholder="Tell me about your project, role or idea…"
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {/* Honeypot — hidden from people, catches bots */}
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" value={form.honey} onChange={set('honey')} className="hidden" aria-hidden="true" />

              {status === 'error' && (
                <div className="border-l-2 border-[#A1222A] bg-[#FBF3F2] px-4 py-3 text-sm text-[#5A1D1D]" role="alert">
                  Sorry, the message couldn’t be sent. Please try again, or{' '}
                  <a href={mailtoFallback} className="underline underline-offset-2">email me directly</a>.
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2">
                <p className="text-xs text-[#7A7770]">Your details are only used to reply to your message.</p>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  {...hover}
                  className="group inline-flex items-center justify-center gap-3 bg-[#141413] px-8 py-4 text-sm text-white transition-colors hover:bg-[#9A773E] disabled:opacity-60 disabled:cursor-wait"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Closing link to work */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto mt-24 pt-10 border-t border-[#E5E3DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-display font-light text-2xl text-[#141413]">Not ready to write yet?</p>
        <button
          onClick={() => onNavigate({ name: 'work' })}
          {...hover}
          className="group inline-flex items-center gap-2 text-sm text-[#141413] hover:text-[#9A773E] transition-colors"
        >
          Explore the projects
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </section>
    </div>
  );
};
