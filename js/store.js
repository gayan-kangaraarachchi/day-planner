// Persistence (localStorage) and per-day data model.
//
// Blocks and shopping items created from templates carry a translation key `k`,
// so they follow the selected language. Editing a block's text removes its key.

import { WEEKDAY, WEEKEND, WEEK_SPLIT, STARTER_SHOP } from './config.js';
import { englishStrings as EN } from './i18n.js';
import { uid, fromKey, isWeekend } from './utils.js';

const STORAGE_KEY = 'dayplanner:v1';

const newShopping = () => STARTER_SHOP.map((k) => ({ id: uid(), k, t: EN[`item.${k}`], done: false }));

/**
 * Data saved before translations existed has English text but no keys.
 * Attach keys where the text still matches the original English, so it translates.
 */
function migrate(data) {
  const tplKeys = [...new Set([...WEEKDAY, ...WEEKEND].map((row) => row[2]))];
  for (const day of Object.values(data.days)) {
    for (const b of day.blocks || []) {
      if (b.k) continue;
      const match = tplKeys.find((k) => EN[`tpl.${k}.t`] === b.t && (EN[`tpl.${k}.n`] || '') === (b.n || ''));
      if (match) b.k = match;
    }
  }
  for (const item of data.shopping || []) {
    if (item.k) continue;
    const match = STARTER_SHOP.find((k) => EN[`item.${k}`] === item.t);
    if (match) item.k = match;
  }
  return data;
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.days) return migrate(data);
  } catch (e) { /* storage unavailable or corrupt */ }
  return { days: {}, shopping: newShopping() };
}

/** Whole app state: { days: { 'YYYY-MM-DD': Day }, shopping: Item[] } */
export const state = load();

export function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

/** Turn a template into fresh block objects (English text kept as a fallback) */
export const makeBlocks = (tpl) =>
  tpl.map(([s, e, k, c]) => ({
    id: uid(), s, e, c, k,
    t: EN[`tpl.${k}.t`],
    n: EN[`tpl.${k}.n`] || '',
    done: false,
  }));

/** Get (or create) the data for a given day key */
export function getDay(key) {
  if (!state.days[key]) {
    const d = fromKey(key);
    state.days[key] = {
      blocks: makeBlocks(isWeekend(d) ? WEEKEND : WEEKDAY),
      steps: 0,
      water: 0,
      meals: { b: '', l: '', d: '', s: '' },
      split: WEEK_SPLIT[d.getDay()],
      wdone: [],
    };
  }
  return state.days[key];
}

/** Read a day without creating it (for history charts) */
export const peekDay = (key) => state.days[key];
