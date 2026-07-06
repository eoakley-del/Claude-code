# Task Manager

A small React + Vite app for two kinds of lists:

- **Tasks** — a notepad-style textarea where you jot down tasks one per line
  and add them all at once. Tasks can be checked off or deleted.
- **Things to enjoy** — a separate list of enjoyable, non-obligatory things
  (not tasks, no checkboxes, no due dates). The app surfaces a "Maybe
  today…" suggestion pulled from that list, with a button to shuffle to a
  different one.

Both lists persist to `localStorage`, so they survive a page reload.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
