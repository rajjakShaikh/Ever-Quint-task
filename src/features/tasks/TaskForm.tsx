import { memo, useCallback, useEffect, useState } from "react";
import { Button, Modal, Select, TextInput } from "../../components/ui";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../types/task";
import {
  createTask,
  formatTagsForInput,
  parseTagsInput,
} from "../../utils/taskUtils";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tagsInput: string;
}

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  status: "Backlog",
  priority: "Medium",
  assignee: "",
  tagsInput: "",
};

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  onSubmit: (task: Task) => void;
}

function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    tagsInput: formatTagsForInput(task.tags),
  };
}

export const TaskForm = memo(function TaskForm({
  isOpen,
  onClose,
  initialTask,
  onSubmit,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(() =>
    initialTask ? taskToFormValues(initialTask) : emptyValues,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormValues, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      setValues(initialTask ? taskToFormValues(initialTask) : emptyValues);
      setErrors({});
    }
  }, [isOpen, initialTask]);

  const reset = useCallback(() => {
    setValues(initialTask ? taskToFormValues(initialTask) : emptyValues);
    setErrors({});
  }, [initialTask]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const validate = useCallback((v: TaskFormValues): boolean => {
    const next: Partial<Record<keyof TaskFormValues, string>> = {};
    if (!v.title.trim()) next.title = "Title is required";
    if (!v.assignee.trim()) next.assignee = "Assignee is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate(values)) return;

      const tags = parseTagsInput(values.tagsInput);
      const now = new Date().toISOString();

      if (initialTask) {
        onSubmit({
          ...initialTask,
          title: values.title.trim(),
          description: values.description.trim(),
          status: values.status,
          priority: values.priority,
          assignee: values.assignee.trim(),
          tags,
          updatedAt: now,
        });
      } else {
        onSubmit(
          createTask({
            title: values.title.trim(),
            description: values.description.trim(),
            status: values.status,
            priority: values.priority,
            assignee: values.assignee.trim(),
            tags,
          }),
        );
      }
      handleClose();
    },
    [values, initialTask, onSubmit, validate, handleClose],
  );

  const update = useCallback(
    <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [errors],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialTask ? "Edit task" : "New task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Title"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          error={errors.title}
          required
          placeholder="Task title"
        />
        <div>
          <label
            htmlFor="task-description"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-slate-500 dark:focus:ring-slate-400"
            placeholder="Optional description"
          />
        </div>
        <Select
          label="Status"
          value={values.status}
          onChange={(e) => update("status", e.target.value as TaskStatus)}
          options={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          label="Priority"
          value={values.priority}
          onChange={(e) => update("priority", e.target.value as TaskPriority)}
          options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
        />
        <TextInput
          label="Assignee"
          value={values.assignee}
          onChange={(e) => update("assignee", e.target.value)}
          error={errors.assignee}
          required
          placeholder="Name or email"
        />
        <TextInput
          label="Tags (comma-separated)"
          value={values.tagsInput}
          onChange={(e) => update("tagsInput", e.target.value)}
          placeholder="e.g. bug, frontend"
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">{initialTask ? "Save" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
});
