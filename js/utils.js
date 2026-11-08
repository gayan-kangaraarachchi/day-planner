// Small DOM, date and string helpers.

export const $ = (id) => document.getElementById(id);

export const uid = () => Math.random().toString(36).slice(2, 9);

export const pad = (n) => String(n).padStart(2, '0');

/** Date -> 'YYYY-MM-DD' in local time */
export const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 'YYYY-MM-DD' -> local Date at midnight */
export const fromKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** 'HH:MM' -> minutes since midnight */
export const mins = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);
