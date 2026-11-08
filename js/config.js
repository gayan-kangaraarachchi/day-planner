// Static configuration: categories, workouts and day templates.

export const STEP_GOAL = 10000;
export const WATER_GOAL = 8;

/** Block categories: key -> [label, CSS colour variable] */
export const CATS = {
  work: ['Work', '--c-work'],
  gym:  ['Gym', '--c-gym'],
  walk: ['Walk', '--c-walk'],
  cook: ['Cooking', '--c-cook'],
  shop: ['Shopping', '--c-shop'],
  meal: ['Meal', '--c-meal'],
  me:   ['Personal', '--c-me'],
  rest: ['Rest', '--c-rest'],
};

/** Workout splits: key -> [label, exercises] */
export const SPLITS = {
  push:   ['Push — chest, shoulders, triceps', ['Bench press 4×8', 'Overhead press 3×10', 'Incline dumbbell press 3×10', 'Lateral raises 3×15', 'Triceps pushdown 3×12']],
  pull:   ['Pull — back, biceps', ['Deadlift 3×5', 'Pull-ups 4×max', 'Barbell row 3×10', 'Face pulls 3×15', 'Biceps curl 3×12']],
  legs:   ['Legs', ['Back squat 4×8', 'Romanian deadlift 3×10', 'Walking lunges 3×12', 'Leg curl 3×12', 'Calf raises 4×15']],
  cardio: ['Cardio + core', ['Incline treadmill 25 min', 'Rowing intervals 10 min', 'Plank 3×45 s', 'Hanging knee raises 3×12', 'Dead bugs 3×10']],
  full:   ['Full body', ['Goblet squat 3×10', 'Push-ups 3×max', 'Dumbbell row 3×10', 'Kettlebell swings 3×15', 'Farmer carry 3×40 m']],
  active: ['Active recovery', ['Long walk 60–90 min', 'Mobility flow 15 min', 'Foam rolling 10 min']],
  rest:   ['Rest day', ['Easy walk only', 'Stretch 10 min']],
};

/** Default split per weekday, Sunday (0) .. Saturday (6) */
export const WEEK_SPLIT = ['rest', 'push', 'pull', 'legs', 'cardio', 'full', 'active'];

/** Templates: [start, end, title, category, note] */
export const WEEKDAY = [
  ['06:45', '07:15', 'Wake up, glass of water, stretch', 'me', ''],
  ['07:15', '07:45', 'Breakfast', 'meal', ''],
  ['07:45', '08:30', 'Morning walk', 'walk', '~4,000 steps'],
  ['08:45', '09:00', 'Plan the day', 'me', 'Top 3 priorities'],
  ['09:00', '12:00', 'Deep work', 'work', 'Focus block, notifications off'],
  ['12:00', '12:45', 'Lunch + walk', 'walk', '~2,500 steps'],
  ['12:45', '17:00', 'Meetings & tasks', 'work', 'Short walk break mid-afternoon'],
  ['17:00', '17:30', 'Snack & change', 'meal', ''],
  ['17:30', '18:45', 'Gym', 'gym', 'See workout card'],
  ['18:45', '19:15', 'Grocery shopping', 'shop', 'Use the shopping list'],
  ['19:15', '20:15', "Cook dinner + prep tomorrow's lunch", 'cook', ''],
  ['20:15', '20:45', 'Evening walk', 'walk', '~2,500 steps to close the 10k'],
  ['21:00', '22:30', 'Free time, wind down', 'rest', 'Screens off by 22:15'],
  ['22:45', '23:00', 'Sleep', 'rest', ''],
];

export const WEEKEND = [
  ['08:00', '08:30', 'Wake up slowly, water', 'me', ''],
  ['08:30', '09:15', 'Big breakfast', 'meal', ''],
  ['09:30', '11:00', 'Long walk', 'walk', '~7,000 steps'],
  ['11:15', '12:15', 'Weekly grocery shop', 'shop', 'Check list before leaving'],
  ['12:30', '13:15', 'Lunch', 'meal', ''],
  ['13:30', '15:30', 'Meal prep for the week', 'cook', 'Cook 2–3 bases: rice, protein, veg'],
  ['16:00', '17:00', 'Gym / mobility', 'gym', 'See workout card'],
  ['17:00', '18:30', 'Free time', 'rest', ''],
  ['18:30', '19:30', 'Cook dinner', 'cook', ''],
  ['19:45', '20:15', 'Evening walk', 'walk', '~3,000 steps'],
  ['20:30', '21:00', 'Plan next week', 'me', 'Calendar, workouts, meals'],
  ['22:45', '23:00', 'Sleep', 'rest', ''],
];

export const STARTER_SHOP = ['Oats', 'Eggs', 'Chicken breast', 'Greek yogurt', 'Spinach', 'Bananas', 'Rice', 'Salmon'];
