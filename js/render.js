// Rendering: turns state into DOM. No event handling here.

import { CATS, SPLITS, STEP_GOAL, WATER_GOAL, LINKED_APPS } from './config.js';
import { state, getDay, peekDay } from './store.js';
import { t, formatNumber as num, formatDate, formatWeekday } from './i18n.js';
import { $, esc, keyOf, mins } from './utils.js';

const RING_LEN = 314.16; // 2πr for r=50

/** Display text for a block: translated if it came from a template, otherwise as typed */
export const blockTitle = (b) => (b.k ? t(`tpl.${b.k}.t`, {}, b.t) : b.t);
export const blockNote = (b) => (b.k ? t(`tpl.${b.k}.n`, {}, '') : b.n);
const itemText = (i) => (i.k ? t(`item.${i.k}`, {}, i.t) : i.t);
export const exercises = (split) => t(`ex.${split}`, {}, []);

/** Markup that depends only on the language: legend, selects, water glasses */
export function renderStatic() {
  $('legend').innerHTML = Object.entries(CATS)
    .map(([k, v]) => `<span style="--cc:var(${v})">${esc(t('cat.' + k))}</span>`).join('');
  $('f-cat').innerHTML = Object.keys(CATS)
    .map((k) => `<option value="${k}">${esc(t('cat.' + k))}</option>`).join('');
  $('split').innerHTML = SPLITS
    .map((k) => `<option value="${k}">${esc(t('split.' + k))}</option>`).join('');
  $('water').innerHTML = Array.from({ length: WATER_GOAL }, (_, i) =>
    `<button data-w="${i + 1}" aria-label="${esc(t('water.glass', { n: i + 1 }))}"></button>`).join('');
  $('stepgoal').textContent = t('steps.of', { n: num(STEP_GOAL) });
  renderAppLinks();
}

/** Buttons that open the linked apps (Liftlog, Pantrylog) */
function renderAppLinks() {
  for (const [slot, app] of Object.entries(LINKED_APPS)) {
    const el = $('link-' + slot);
    if (!el) continue;
    el.hidden = !app.url;
    el.href = app.url;
    el.textContent = `${t('link.open', { app: app.name })} ↗`;
  }
}

function renderHeader(cur, key, todayKey) {
  $('datetitle').textContent = formatDate(cur);
  $('dow').textContent = (key === todayKey ? `${t('nav.todayPrefix')} · ` : '') + formatWeekday(cur);
  $('datepick').value = key;
}

function renderTimeline(day, isToday) {
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  day.blocks.sort((a, b) => mins(a.s) - mins(b.s));
  $('tl').innerHTML = day.blocks.map((b) => {
    const live = isToday && nowM >= mins(b.s) && nowM < mins(b.e);
    const color = CATS[b.c] || '--c-rest';
    const title = blockTitle(b);
    const note = blockNote(b);
    return `<li class="blk${b.done ? ' done' : ''}${live ? ' now' : ''}" style="--cc:var(${color})">
      <span class="t mono">${b.s}<br>${b.e}</span><span class="stripe"></span>
      <div class="body" data-edit="${b.id}" role="button" tabindex="0">
        <div class="title">${esc(title)}${live ? `<span class="pill">${esc(t('tl.now'))}</span>` : ''}</div>
        ${note ? `<div class="note">${esc(note)}</div>` : ''}
      </div>
      <input type="checkbox" data-done="${b.id}" ${b.done ? 'checked' : ''} aria-label="${esc(t('tl.doneAria', { t: title }))}">
    </li>`;
  }).join('') || `<li class="hint">${esc(t('tl.empty'))}</li>`;
}

function renderSteps(day, cur, key) {
  const steps = day.steps || 0;
  const pct = Math.min(steps / STEP_GOAL, 1);
  $('stepnum').textContent = num(steps);
  $('ringfg').style.strokeDashoffset = RING_LEN * (1 - pct);
  $('remain').textContent = steps >= STEP_GOAL ? t('steps.reached') : t('steps.toGo', { n: num(STEP_GOAL - steps) });
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
    return `<span class="${cls}" style="height:${(s / max) * 100}%" title="${esc(t('steps.barTitle', { n: num(s) }))}"></span>`;
  }).join('');
  const labels = days.map((d) => `<small>${esc(formatWeekday(d, 'narrow'))}</small>`).join('');

  $('week').innerHTML =
    `<div class="week-bars"><span class="goal" style="bottom:${(STEP_GOAL / max) * 100}%"></span>${bars}</div>` +
    `<div class="week-days">${labels}</div>`;
  return pct;
}

function renderWorkout(day) {
  $('split').value = day.split;
  const items = exercises(day.split);
  $('wolist').innerHTML = items.map((text, i) => {
    const done = day.wdone.includes(i);
    return `<li class="${done ? 'done' : ''}"><input type="checkbox" id="wo${i}" data-wo="${i}" ${done ? 'checked' : ''}><span><label for="wo${i}">${esc(text)}</label></span></li>`;
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
  $('shoplist').innerHTML = state.shopping.map((i) => {
    const text = itemText(i);
    return `<li class="${i.done ? 'done' : ''}"><input type="checkbox" id="sh${i.id}" data-shop="${i.id}" ${i.done ? 'checked' : ''}><span><label for="sh${i.id}">${esc(text)}</label></span><button data-rmshop="${i.id}" aria-label="${esc(t('shop.remove', { t: text }))}">×</button></li>`;
  }).join('') || `<li class="hint">${esc(t('shop.empty'))}</li>`;
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
  stat('steps', num(day.steps || 0), stepPct);
  stat('work', `${day.wdone.length}/${woTotal}`, woTotal ? day.wdone.length / woTotal : 0);
  stat('water', `${day.water}/${WATER_GOAL}`, day.water / WATER_GOAL);
}
