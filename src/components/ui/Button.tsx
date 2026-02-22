import { memo, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 disabled:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:disabled:bg-slate-700",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-500",
};

export const Button = memo(function Button({
  variant = "primary",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
});
