# Team Workflow Board

A simple Trello-style kanban board for managing tasks in **Backlog**, **In Progress**, and **Done**. Built with React, TypeScript, and Tailwind.

## Stack

- **React 19** + **TypeScript**
- **Vite** – build tool
- **Zustand** – state (tasks + theme)
- **Tailwind CSS** – styling (incl. dark mode)
- **react-dnd** + **react-dnd-html5-backend** – drag & drop
- **localStorage** – persistence (tasks + theme)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command   | Description        |
|----------|--------------------|
| `npm run dev`    | Start dev server    |
| `npm run build`  | Production build    |
| `npm run preview` | Preview production  |
| `npm run lint`    | Run ESLint         |

## Features

- Three columns: Backlog, In Progress, Done
- Create, edit, and move tasks (dropdown or drag & drop)
- Filter by search text and priority; sort by date or priority
- URL query params for filters (shareable views)
- Dark / light mode (toggle in navbar, persisted)
- Tasks and theme saved in localStorage

## Project structure

```
src/
  components/ui/   # Button, Input, Select, Modal, Card, Badge, Toast, ThemeToggle
  features/tasks/  # TaskBoard, TaskCard, TaskForm, dnd
  store/           # taskStore (Zustand), themeStore
  hooks/           # useTasksStorage (filters, sort, URL sync)
  types/           # Task, TaskStatus, TaskPriority, etc.
  utils/           # storage, taskUtils, seedTasks
```

## License

MIT
