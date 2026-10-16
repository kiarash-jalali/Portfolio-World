const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes text before it is placed inside an HTML template string. */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ENTITIES[char]);
}
