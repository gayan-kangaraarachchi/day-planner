// Rendering: turns state into DOM. No event handling here.

import { CATS, SPLITS, STEP_GOAL, WATER_GOAL } from './config.js';
import { state, getDay, peekDay } from './store.js';
import { $, esc, fmt, keyOf, mins } from './utils.js';

const RING_LEN = 314.16; // 2πr for r=50

/** One-time static markup: legend, selects, water glasses */
export function renderStatic() {
  $('legend').innerHTML = Object.values(CATS)
    .map(([n, v]) => `<span style="--cc:var(${v})">${n}</span>`).join('');
  $('f-cat').innerHTML = Object.entries(CATS)
    .map(([k, [n]]) => `<option value="${k}">${n}</option>`).join('');
  $('split').innerHTML = Object.entries(SPLITS)
    .map(([k, [n]]) => `<option value="${k}">${n}</option>`).join('');
  $('water').innerHTML = Array.from({ length: WATER_GOAL }, (_, i) =>
    `<button data-w="${i + 1}" aria-label="${i + 1} glasses"></button>`).join('');
}

function renderHeader(cur, key, todayKey) {
  $('datetitle').textContent = cur.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  $('dow').textContent = (key === todayKey ? 'Today · ' : '') + cur.toLocaleDateString('en-GB', { weekday: 'long' });
  $('datepick').value = key;
}

function renderTimeline(day, isToday) {
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  day.blocks.sort((a, b) => mins(a.s) - mins(b.s));
  $('tl').innerHTML = day.blocks.map((b) => {
    const live = isToday && nowM >= mins(b.s) && nowM < mins(b.e);
    const color = CATS[b.c]?.[1] || '--c-rest';
    return `<li class="blk${b.done ? ' done' : ''}${live ? ' now' : ''}" style="--cc:var(${color})">
      <span class="t mono">${b.s}<br>${b.e}</span><span class="stripe"></span>
      <div class="body" data-edit="${b.id}" role="button" tabindex="0">
        <div class="title">${esc(b.t)}${live ? '<span class="pill">Now</span>' : ''}</div>
        ${b.n ? `<div class="note">${esc(b.n)}</div>` : ''}
      </div>
      <input type="checkbox" data-done="${b.id}" ${b.done ? 'checked' : ''} aria-label="Done: ${esc(b.t)}">
    </li>`;
  }).join('') || '<li class="hint">No blocks yet. Add one or load a template.</li>';
}

function renderSteps(day, cur, key) {
  const steps = day.steps || 0;
  const pct = Math.min(steps / STEP_GOAL, 1);
  $('stepnum').textContent = fmt(steps);
  $('ringfg').style.strokeDashoffset = RING_LEN * (1 - pct);
  $('remain').textContent = steps >= STEP_GOAL ? 'Goal reached' : `${fmt(STEP_GOAL - steps)} to go`;
  if (document.activeElement !== $('stepin')) $('stepin').value = '';

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(cur);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const values = days.map((d) => peekDay(keyOf(d))?.steps || 0);
  const max = Math.max(STEP_GOAL * 1.2, ...values);

  const bars = days.map((d, i) => {
    const s = values[i];
    const cls = `b${s >= STEP_GOAL ? ' hit' : ''}${keyOf(d) === key ? ' sel' : ''}`;
    return `<span class="${cls}" style="height:${(s / max) * 100}%" title="${fmt(s)} steps"></span>`;
  }).join('');
  const labels = days.map((d) => `<small>${d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</small>`).join('');

  $('week').innerHTML =
    `<div class="week-bars"><span class="goal" style="bottom:${(STEP_GOAL / max) * 100}%"></span>${bars}</div>` +
    `<div class="week-days">${labels}</div>`;
  return pct;
}

function renderWorkout(day) {
  $('split').value = day.split;
  const items = SPLITS[day.split][1];
  $('wolist').innerHTML = items.map((t, i) => {
    const done = day.wdone.includes(i);
    return `<li class="${done ? 'done' : ''}"><input type="checkbox" id="wo${i}" data-wo="${i}" ${done ? 'checked' : ''}><span><label for="wo${i}">${esc(t)}</label></span></li>`;
  }).join('');
  return items.length;
}

function renderMeals(day) {
  for (const m of ['b', 'l', 'd', 's']) {
    const el = $('m-' + m);
    if (document.activeElement !== el) el.value = day.meals[m] || '';
  }
}

function renderWater(day) {
  document.querySelectorAll('#water button')
    .forEach((b) => b.classList.toggle('on', +b.dataset.w <= day.water));
}

function renderShopping() {
  $('shoplist').innerHTML = state.shopping.map((i) =>
    `<li class="${i.done ? 'done' : ''}"><input type="checkbox" id="sh${i.id}" data-shop="${i.id}" ${i.done ? 'checked' : ''}><span><label for="sh${i.id}">${esc(i.t)}</label></span><button data-rmshop="${i.id}" aria-label="Remove ${esc(i.t)}">×</button></li>`
  ).join('') || '<li class="hint">List is empty.</li>';
}

function stat(id, text, ratio) {
  $('s-' + id).textContent = text;
  $('b-' + id).style.width = `${ratio * 100}%`;
}

/** Full re-render for the given date */
export function render(cur) {
  const key = keyOf(cur);
  const todayKey = keyOf(new Date());
  const day = getDay(key);

  renderHeader(cur, key, todayKey);
  renderTimeline(day, key === todayKey);
  const stepPct = renderSteps(day, cur, key);
  const woTotal = renderWorkout(day);
  renderMeals(day);
  renderWater(day);
  renderShopping();

  const done = day.blocks.filter((b) => b.done).length;
  stat('sched', `${done}/${day.blocks.length}`, day.blocks.length ? done / day.blocks.length : 0);
  stat('steps', fmt(day.steps || 0), stepPct);
  stat('work', `${day.wdone.length}/${woTotal}`, woTotal ? day.wdone.length / woTotal : 0);
  stat('water', `${day.water}/${WATER_GOAL}`, day.water / WATER_GOAL);
}
