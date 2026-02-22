import { create } from "zustand";
import type { Task } from "../types/task";
import { loadTasksFromStorage, saveTasksToStorage } from "../utils/storage";
import { DUMMY_TASKS } from "../utils/seedTasks";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Task["status"]) => void;
  hydrate: () => void;
  persist: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
    get().persist();
  },

  updateTask: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: now } : t
      ),
    }));
    get().persist();
  },

  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    get().persist();
  },

  moveTask: (id, status) => {
    get().updateTask(id, { status });
  },

  hydrate: () => {
    const stored = loadTasksFromStorage<Task[]>([]);
    const tasks = stored.length > 0 ? stored : DUMMY_TASKS;
    set({ tasks });
    if (stored.length === 0) {
      saveTasksToStorage(tasks);
    }
  },

  persist: () => {
    saveTasksToStorage(get().tasks);
  },
}));
