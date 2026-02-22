import { memo } from "react";
import { useDrag } from "react-dnd";
import { Badge, Button, Card } from "../../components/ui";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";
import { TASK_PRIORITIES } from "../../types/task";
import { TASK_DRAG_TYPE, type TaskDragItem } from "./dnd";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onMove: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
}

const priorityVariant: Record<TaskPriority, "danger" | "warning" | "success"> =
  {
    High: "danger",
    Medium: "warning",
    Low: "success",
  };

const selectClass =
  "rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-400";

export const TaskCard = memo(function TaskCard({
  task,
  onEdit,
  onMove,
  onDelete,
  onPriorityChange,
}: TaskCardProps) {
  const [{ isDragging }, dragRef] = useDrag<
    TaskDragItem,
    void,
    { isDragging: boolean }
  >({
    type: TASK_DRAG_TYPE,
    item: () => ({ id: task.id }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={(el): void => {
        dragRef(el);
      }}
      className={isDragging ? "opacity-50" : undefined}
    >
      <Card className="p-4 transition hover:shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-slate-900 line-clamp-2 dark:text-slate-100">
              {task.title}
            </h3>
            <Badge variant={priorityVariant[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-300">
              {task.description}
            </p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assignee: {task.assignee || "—"}
          </p>
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
            <select
              value={task.status}
              onChange={(e) => onMove(task.id, e.target.value as TaskStatus)}
              className={selectClass}
              aria-label="Move task"
            >
              <option value="Backlog">Backlog</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={task.priority}
              onChange={(e) =>
                onPriorityChange(task.id, e.target.value as TaskPriority)
              }
              className={selectClass}
              aria-label="Change priority"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
});
