// Static configuration. All visible text lives in js/locales/*.js.

export const STEP_GOAL = 10000;
export const WATER_GOAL = 8;

/** Block categories: key -> CSS colour variable. Labels: 'cat.<key>' */
export const CATS = {
  work: '--c-work',
  gym: '--c-gym',
  walk: '--c-walk',
  cook: '--c-cook',
  shop: '--c-shop',
  meal: '--c-meal',
  me: '--c-me',
  rest: '--c-rest',
};

/** Workout splits. Labels: 'split.<key>', exercises: 'ex.<key>' */
export const SPLITS = ['push', 'pull', 'legs', 'cardio', 'full', 'active', 'rest'];

/** Default split per weekday, Sunday (0) .. Saturday (6) */
export const WEEK_SPLIT = ['rest', 'push', 'pull', 'legs', 'cardio', 'full', 'active'];

/** Templates: [start, end, text key, category]. Text: 'tpl.<key>.t' / 'tpl.<key>.n' */
export const WEEKDAY = [
  ['06:45', '07:15', 'wake', 'me'],
  ['07:15', '07:45', 'breakfast', 'meal'],
  ['07:45', '08:30', 'morningWalk', 'walk'],
  ['08:45', '09:00', 'plan', 'me'],
  ['09:00', '12:00', 'deepWork', 'work'],
  ['12:00', '12:45', 'lunchWalk', 'walk'],
  ['12:45', '17:00', 'meetings', 'work'],
  ['17:00', '17:30', 'snack', 'meal'],
  ['17:30', '18:45', 'gym', 'gym'],
  ['18:45', '19:15', 'groceries', 'shop'],
  ['19:15', '20:15', 'cookPrep', 'cook'],
  ['20:15', '20:45', 'eveningWalk', 'walk'],
  ['21:00', '22:30', 'windDown', 'rest'],
  ['22:45', '23:00', 'sleep', 'rest'],
];

export const WEEKEND = [
  ['08:00', '08:30', 'wakeSlow', 'me'],
  ['08:30', '09:15', 'bigBreakfast', 'meal'],
  ['09:30', '11:00', 'longWalk', 'walk'],
  ['11:15', '12:15', 'weeklyShop', 'shop'],
  ['12:30', '13:15', 'lunch', 'meal'],
  ['13:30', '15:30', 'mealPrep', 'cook'],
  ['16:00', '17:00', 'gymMobility', 'gym'],
  ['17:00', '18:30', 'freeTime', 'rest'],
  ['18:30', '19:30', 'cookDinner', 'cook'],
  ['19:45', '20:15', 'eveningWalkWe', 'walk'],
  ['20:30', '21:00', 'planWeek', 'me'],
  ['22:45', '23:00', 'sleep', 'rest'],
];

/**
 * Other apps linked from the planner. Change `url` if you host an app elsewhere
 * (for example on GitHub Pages).
 */
export const LINKED_APPS = {
  workout: { name: 'Liftlog', url: 'https://claude.ai/artifact/StWrNcohBmz1eUCdff9rGY' },
  shopping: { name: 'Pantrylog', url: 'https://claude.ai/artifact/VQWYrokQQnaPgYUJ5W18dH' },
};

/** Starter shopping items. Text: 'item.<key>' */
export const STARTER_SHOP = ['oats', 'eggs', 'chicken', 'yogurt', 'spinach', 'bananas', 'rice', 'salmon'];
