import type { Task } from "../types/task";
import { createTask } from "./taskUtils";

export const DUMMY_TASKS: Task[] = [
  createTask({
    title: "Set up project structure",
    description: "Initialize repo, ESLint, Tailwind, and folder structure.",
    status: "Done",
    priority: "High",
    assignee: "Rajjak Shaikh",
    tags: ["setup", "devops"],
  }),
  createTask({
    title: "Implement task board UI",
    description: "Three columns: Backlog, In Progress, Done.",
    status: "In Progress",
    priority: "High",
    assignee: "Tarun Sharma",
    tags: ["frontend", "ui"],
  }),
  createTask({
    title: "Add localStorage persistence",
    description: "Save and load tasks from localStorage.",
    status: "In Progress",
    priority: "Medium",
    assignee: "Rajjak Shaikh",
    tags: ["storage"],
  }),
  createTask({
    title: "Task form validation",
    description: "Required fields and error messages.",
    status: "Backlog",
    priority: "Medium",
    assignee: "pratik dhodge",
    tags: ["forms", "validation"],
  }),
  createTask({
    title: "Filter and sort tasks",
    description: "By priority, search text, and date.",
    status: "Backlog",
    priority: "Low",
    assignee: "Ashish Naik",
    tags: ["ux"],
  }),
];
