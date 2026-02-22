import { memo, useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-slate-700 text-white",
};

export const Toast = memo(function Toast({
  message,
  type = "info",
  onDismiss,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  return (
    <div
      role="alert"
      className={`fixed bottom-4 right-4 z-[100] rounded-lg px-4 py-3 shadow-lg ${typeStyles[type]}`}
    >
      {message}
    </div>
  );
});
