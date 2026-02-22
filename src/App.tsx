import { useCallback, useState } from "react";
import { Button, Select, TextInput, ThemeToggle, Toast } from "./components/ui";
import { TaskBoard, TaskForm } from "./features/tasks";
import { useTasksStorage } from "./hooks/useTasksStorage";
import { useTaskStore } from "./store/taskStore";
import type { Task } from "./types/task";
import type { ToastType } from "./components/ui/Toast";
import { TASK_PRIORITIES } from "./types/task";

type ToastState = { message: string; type: ToastType } | null;

function App() {
  const { groupedTasks, filters, setFilters } = useTasksStorage();
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const moveTask = useTaskStore((s) => s.moveTask);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const handleFormSubmit = useCallback(
    (task: Task) => {
      if (editingTask) {
        updateTask(editingTask.id, {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee,
          tags: task.tags,
        });
        showToast("Task updated", "success");
      } else {
        addTask(task);
        showToast("Task created", "success");
      }
      setEditingTask(null);
      setFormOpen(false);
    },
    [editingTask, updateTask, addTask, showToast]
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleMoveTask = useCallback(
    (taskId: string, status: Task["status"]) => {
      moveTask(taskId, status);
      showToast("Task moved", "info");
    },
    [moveTask, showToast]
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Team Workflow Board
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 text-slate-900 dark:text-slate-100">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <TextInput
              label="Search"
              placeholder="Search tasks..."
              value={filters.searchText}
              onChange={(e) => setFilters({ searchText: e.target.value })}
              className="min-w-[180px]"
            />
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(e) =>
                setFilters({
                  priority: e.target.value as "" | "Low" | "Medium" | "High",
                })
              }
              options={[
                { value: "", label: "All" },
                ...TASK_PRIORITIES.map((p) => ({ value: p, label: p })),
              ]}
              className="w-[130px]"
            />
            <Select
              label="Sort by"
              value={filters.sortField}
              onChange={(e) =>
                setFilters({
                  sortField: e.target.value as "createdAt" | "priority",
                })
              }
              options={[
                { value: "createdAt", label: "Date" },
                { value: "priority", label: "Priority" },
              ]}
              className="w-[110px]"
            />
            <Select
              label="Order"
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters({ sortOrder: e.target.value as "asc" | "desc" })
              }
              options={[
                { value: "desc", label: "Desc" },
                { value: "asc", label: "Asc" },
              ]}
              className="w-[100px]"
            />
          </div>
          <Button onClick={() => setFormOpen(true)}>New task</Button>
        </div>

        <TaskBoard
          groupedTasks={groupedTasks}
          onEditTask={handleEdit}
          onMoveTask={handleMoveTask}
        />
      </main>

      <TaskForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        initialTask={editingTask}
        onSubmit={handleFormSubmit}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
