import { data } from '../content.js';
import { toast } from '../core/toast.js';

/** The form doesn't send anything itself; it opens a prepared draft in the visitor's email app. */
export function buildMailto({ name, email, message }) {
  const subject = `Hello from ${name.trim()}`;
  const body = `${message.trim()}\n\nFrom: ${name.trim()}\nEmail: ${email.trim()}`;
  return `mailto:${data.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function initContact() {
  document.querySelector('[data-copy-email]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(data.profile.email);
      toast('Email copied. Say hello whenever you like.');
    } catch {
      // Without clipboard access, at least show the address.
      toast(data.profile.email);
    }
  });

  document.querySelector('#contactForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    location.href = buildMailto(Object.fromEntries(new FormData(form)));
    toast('Your email draft is ready in your email app.');
  });
}
