// Translations: language selection, string lookup and locale-aware formatting.
//
// To add a language: create js/locales/<code>.js (copy en-GB.js), import it below,
// add it to LANGUAGES, and add the file to ASSETS in sw.js.

import enGB from './locales/en-GB.js';
import fiFI from './locales/fi-FI.js';
import svSE from './locales/sv-SE.js';

/** code -> { name shown in the dropdown (in its own language), strings } */
export const LANGUAGES = {
  'en-GB': { name: 'English', strings: enGB },
  'fi-FI': { name: 'Suomi', strings: fiFI },
  'sv-SE': { name: 'Svenska', strings: svSE },
};

export const DEFAULT_LANG = 'en-GB';
const STORAGE_KEY = 'dayplanner:lang';

function loadLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES[saved]) return saved;
  } catch (e) { /* storage unavailable */ }
  return DEFAULT_LANG;
}

let current = loadLang();

export const getLang = () => current;

export function setLang(code) {
  if (!LANGUAGES[code]) return;
  current = code;
  try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* ignore */ }
  document.documentElement.lang = code;
}

/**
 * Look up a string. Falls back to English, then to `fallback` (defaults to the key).
 * `{name}` placeholders are replaced from `vars`. Arrays are returned as-is.
 */
export function t(key, vars = {}, fallback = key) {
  const value = LANGUAGES[current].strings[key] ?? enGB[key];
  if (value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

/** English source strings, used to recognise data saved before translations existed */
export const englishStrings = enGB;

/* ---------- Formatting ---------- */

export const formatNumber = (n) => n.toLocaleString(current);

const capitalise = (s) => s.charAt(0).toLocaleUpperCase(current) + s.slice(1);

export const formatDate = (d) =>
  d.toLocaleDateString(current, { day: 'numeric', month: 'long', year: 'numeric' });

export const formatWeekday = (d, style = 'long') =>
  capitalise(d.toLocaleDateString(current, { weekday: style }));

/* ---------- Static markup ---------- */

/**
 * Translate elements marked in the HTML:
 *   data-i18n="key"              -> textContent
 *   data-i18n-placeholder="key"  -> placeholder
 *   data-i18n-aria="key"         -> aria-label
 */
export function translatePage(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.title = t('app.title');
  document.documentElement.lang = current;
}
