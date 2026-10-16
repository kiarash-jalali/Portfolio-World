export { escapeHtml as esc } from '../../src/world/core/html.js';

/**
 * Template tag for page markup. Line breaks and the indentation around them are
 * removed, so templates can be laid out readably without adding whitespace to
 * the page. Never break a line where a space matters, such as between two words.
 * Interpolated values are inserted as they are; escape text with `esc`.
 */
export function html(strings, ...values) {
  const compact = strings.map((part) => part.replace(/\s*\n\s*/g, ''));
  return compact.reduce((out, part, i) => out + part + (i < values.length ? values[i] : ''), '');
}

/** Renders one piece of markup per item and joins them. */
export const each = (items, render) => items.map(render).join('');
