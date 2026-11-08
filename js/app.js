// Entry point: wires UI events to state and triggers renders.

import { WEEKDAY, WEEKEND } from './config.js';
import { state, save, getDay, makeBlocks } from './store.js';
import { render, renderStatic } from './render.js';
import { $, uid, keyOf, fromKey, mins, startOfToday } from './utils.js';

let cur = startOfToday();
let editingId = null;

const day = () => getDay(keyOf(cur));
const refresh = () => render(cur);
const commit = () => { save(); refresh(); };

/* ---------- Date navigation ---------- */
function goTo(date) {
  cur = date;
  closeForm();
  refresh();
}
function shift(n) {
  const d = new Date(cur);
  d.setDate(d.getDate() + n);
  goTo(d);
}

function bindDateNav() {
  $('prev').onclick = () => shift(-1);
  $('next').onclick = () => shift(1);
  $('today').onclick = () => goTo(startOfToday());
  $('datepick').onchange = (e) => { if (e.target.value) goTo(fromKey(e.target.value)); };
}

/* ---------- Schedule blocks ---------- */
function openForm(block) {
  editingId = block ? block.id : null;
  $('f-start').value = block ? block.s : '18:00';
  $('f-end').value = block ? block.e : '19:00';
  $('f-title').value = block ? block.t : '';
  $('f-note').value = block ? block.n : '';
  $('f-cat').value = block ? block.c : 'me';
  $('f-del').hidden = !block;
  $('f-err').textContent = '';
  $('editform').hidden = false;
  $('f-title').focus();
}

function closeForm() {
  $('editform').hidden = true;
  editingId = null;
}

function saveForm(e) {
  e.preventDefault();
  const s = $('f-start').value;
  const en = $('f-end').value;
  const t = $('f-title').value.trim();
  if (!s || !en || !t) { $('f-err').textContent = 'Add a start time, end time and title.'; return; }
  if (mins(en) <= mins(s)) { $('f-err').textContent = 'End time must be after the start time.'; return; }

  const D = day();
  const values = { s, e: en, t, c: $('f-cat').value, n: $('f-note').value.trim() };
  if (editingId) Object.assign(D.blocks.find((b) => b.id === editingId), values);
  else D.blocks.push({ id: uid(), done: false, ...values });
  closeForm();
  commit();
}

function loadTemplate(tpl, name) {
  day().blocks = makeBlocks(tpl);
  closeForm();
  commit();
  $('tplmsg').textContent = `Loaded the ${name} template for this day.`;
}

function bindSchedule() {
  $('addblk').onclick = () => openForm(null);
  $('f-cancel').onclick = closeForm;
  $('f-del').onclick = () => {
    const D = day();
    D.blocks = D.blocks.filter((b) => b.id !== editingId);
    closeForm();
    commit();
  };
  $('editform').onsubmit = saveForm;

  const tl = $('tl');
  tl.addEventListener('click', (e) => {
    const el = e.target.closest('[data-edit]');
    if (el) openForm(day().blocks.find((b) => b.id === el.dataset.edit));
  });
  tl.addEventListener('keydown', (e) => {
    const el = e.target.closest('[data-edit]');
    if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); el.click(); }
  });
  tl.addEventListener('change', (e) => {
    const id = e.target.dataset.done;
    if (id) { day().blocks.find((b) => b.id === id).done = e.target.checked; commit(); }
  });

  $('tplWeek').onclick = () => loadTemplate(WEEKDAY, 'weekday');
  $('tplWeekend').onclick = () => loadTemplate(WEEKEND, 'weekend');
}

/* ---------- Steps ---------- */
function setSteps(n) {
  day().steps = Math.max(0, Math.round(n));
  commit();
}

function bindSteps() {
  $('stepset').onclick = () => {
    const v = parseInt($('stepin').value, 10);
    if (!Number.isNaN(v)) { $('stepin').blur(); setSteps(v); }
  };
  $('stepin').onkeydown = (e) => { if (e.key === 'Enter') $('stepset').click(); };
  document.querySelectorAll('[data-add]').forEach((b) => {
    b.onclick = () => setSteps((day().steps || 0) + Number(b.dataset.add));
  });
}

/* ---------- Workout ---------- */
function bindWorkout() {
  $('split').onchange = (e) => {
    const D = day();
    D.split = e.target.value;
    D.wdone = [];
    commit();
  };
  $('wolist').addEventListener('change', (e) => {
    const i = Number(e.target.dataset.wo);
    const D = day();
    D.wdone = e.target.checked ? [...new Set([...D.wdone, i])] : D.wdone.filter((x) => x !== i);
    commit();
  });
}

/* ---------- Meals & water ---------- */
function bindMealsAndWater() {
  for (const m of ['b', 'l', 'd', 's']) {
    $('m-' + m).addEventListener('input', (e) => { day().meals[m] = e.target.value; save(); });
  }
  $('water').addEventListener('click', (e) => {
    const w = Number(e.target.dataset.w);
    if (!w) return;
    const D = day();
    D.water = D.water === w ? w - 1 : w;
    commit();
  });
}

/* ---------- Shopping ---------- */
function bindShopping() {
  $('shopform').onsubmit = (e) => {
    e.preventDefault();
    const t = $('shopin').value.trim();
    if (!t) return;
    state.shopping.push({ id: uid(), t, done: false });
    $('shopin').value = '';
    commit();
  };
  $('shoplist').addEventListener('change', (e) => {
    const id = e.target.dataset.shop;
    if (id) { state.shopping.find((i) => i.id === id).done = e.target.checked; commit(); }
  });
  $('shoplist').addEventListener('click', (e) => {
    const id = e.target.dataset.rmshop;
    if (id) { state.shopping = state.shopping.filter((i) => i.id !== id); commit(); }
  });
  $('clearshop').onclick = () => {
    state.shopping = state.shopping.filter((i) => !i.done);
    commit();
  };
}

/* ---------- Offline support ---------- */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* optional */ });
  }
}

/* ---------- Boot ---------- */
function init() {
  renderStatic();
  bindDateNav();
  bindSchedule();
  bindSteps();
  bindWorkout();
  bindMealsAndWater();
  bindShopping();
  refresh();
  setInterval(refresh, 60_000); // keep the "Now" marker current
  registerServiceWorker();
}

init();
