// Persistence (localStorage) and per-day data model.

import { WEEKDAY, WEEKEND, WEEK_SPLIT, STARTER_SHOP } from './config.js';
import { uid, fromKey, isWeekend } from './utils.js';

const STORAGE_KEY = 'dayplanner:v1';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.days) return data;
  } catch (e) { /* storage unavailable or corrupt */ }
  return {
    days: {},
    shopping: STARTER_SHOP.map((t) => ({ id: uid(), t, done: false })),
  };
}

/** Whole app state: { days: { 'YYYY-MM-DD': Day }, shopping: Item[] } */
export const state = load();

export function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

/** Turn a template into fresh block objects */
export const makeBlocks = (tpl) =>
  tpl.map(([s, e, t, c, n]) => ({ id: uid(), s, e, t, c, n, done: false }));

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
