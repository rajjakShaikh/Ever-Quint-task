import { useCallback, useEffect, useMemo, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import type { Task, TaskPriority, TaskSortField, TaskSortOrder } from "../types/task";

export interface TaskFilters {
  searchText: string;
  priority: TaskPriority | "";
  sortField: TaskSortField;
  sortOrder: TaskSortOrder;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function filterAndSortTasks(
  tasks: Task[],
  filters: TaskFilters
): Record<Task["status"], Task[]> {
  let list = tasks;

  if (filters.searchText.trim()) {
    const q = filters.searchText.trim().toLowerCase();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filters.priority) {
    list = list.filter((t) => t.priority === filters.priority);
  }

  list = [...list].sort((a, b) => {
    if (filters.sortField === "createdAt") {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return filters.sortOrder === "asc" ? diff : -diff;
    }
    const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return filters.sortOrder === "asc" ? diff : -diff;
  });

  const backlog = list.filter((t) => t.status === "Backlog");
  const inProgress = list.filter((t) => t.status === "In Progress");
  const done = list.filter((t) => t.status === "Done");

  return { Backlog: backlog, "In Progress": inProgress, Done: done };
}

const DEFAULT_FILTERS: TaskFilters = {
  searchText: "",
  priority: "",
  sortField: "createdAt",
  sortOrder: "desc",
};

function parseFiltersFromSearchParams(search: string): Partial<TaskFilters> {
  const params = new URLSearchParams(search);
  const priority = params.get("priority");
  const sortField = params.get("sortField");
  const sortOrder = params.get("sortOrder");
  const searchText = params.get("q") ?? "";
  return {
    searchText,
    priority:
      priority && ["Low", "Medium", "High"].includes(priority)
        ? (priority as TaskPriority)
        : "",
    sortField: sortField === "priority" ? "priority" : "createdAt",
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
  };
}

function filtersToSearchParams(filters: TaskFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.searchText) params.set("q", filters.searchText);
  if (filters.priority) params.set("priority", filters.priority);
  params.set("sortField", filters.sortField);
  params.set("sortOrder", filters.sortOrder);
  return params;
}

function getInitialFilters(): TaskFilters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  const fromUrl = parseFiltersFromSearchParams(window.location.search);
  return { ...DEFAULT_FILTERS, ...fromUrl };
}

export function useTasksStorage(initialFilters?: Partial<TaskFilters>) {
  const tasks = useTaskStore((s) => s.tasks);
  const hydrate = useTaskStore((s) => s.hydrate);

  const [filters, setFiltersState] = useState<TaskFilters>(() => ({
    ...getInitialFilters(),
    ...initialFilters,
  }));

  const setFilters = useCallback((updates: Partial<TaskFilters>) => {
    setFiltersState((prev) => {
      const next = { ...prev, ...updates };
      const params = filtersToSearchParams(next);
      const url = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, "", url);
      return next;
    });
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const groupedTasks = useMemo(
    () => filterAndSortTasks(tasks, filters),
    [tasks, filters]
  );

  return {
    tasks,
    filters,
    setFilters,
    groupedTasks,
  };
}
