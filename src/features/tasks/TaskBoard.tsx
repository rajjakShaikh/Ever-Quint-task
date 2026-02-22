import { memo } from "react";
import { useDrop } from "react-dnd";
import type { Task, TaskStatus } from "../../types/task";
import { TASK_DRAG_TYPE, type TaskDragItem } from "./dnd";
import { TaskCard } from "./TaskCard";

const COLUMNS: TaskStatus[] = ["Backlog", "In Progress", "Done"];

interface TaskBoardProps {
  groupedTasks: Record<TaskStatus, Task[]>;
  onEditTask: (task: Task) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
}

function DroppableColumn({
  status,
  children,
  onDrop,
}: {
  status: TaskStatus;
  children: React.ReactNode;
  onDrop: (taskId: string) => void;
}) {
  const [{ isOver }, dropRef] = useDrop<
    TaskDragItem,
    void,
    { isOver: boolean }
  >({
    accept: TASK_DRAG_TYPE,
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <section
      ref={(el): void => {
        dropRef(el);
      }}
      className={`flex flex-col rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver
          ? "border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-slate-700/50"
          : "border-slate-200 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-800/50"
      }`}
      aria-label={`Column: ${status}`}
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
        {status}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

export const TaskBoard = memo(function TaskBoard({
  groupedTasks,
  onEditTask,
  onMoveTask,
}: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((status) => (
        <DroppableColumn
          key={status}
          status={status}
          onDrop={(taskId) => onMoveTask(taskId, status)}
        >
          {groupedTasks[status].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onMove={onMoveTask}
            />
          ))}
        </DroppableColumn>
      ))}
    </div>
  );
});
