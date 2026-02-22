import { memo, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = memo(function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
