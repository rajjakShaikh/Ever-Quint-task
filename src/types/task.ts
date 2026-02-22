export type TaskStatus = "Backlog" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskSortField = "createdAt" | "priority";
export type TaskSortOrder = "asc" | "desc";

export const TASK_STATUSES: TaskStatus[] = ["Backlog", "In Progress", "Done"];
export const TASK_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];
