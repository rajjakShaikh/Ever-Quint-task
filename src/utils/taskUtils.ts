import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types/task";

export function createTask(overrides: Partial<Task> = {}): Task {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    status: "Backlog",
    priority: "Medium",
    assignee: "",
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(", ");
}

export { TASK_STATUSES, TASK_PRIORITIES };
export type { TaskStatus, TaskPriority };
