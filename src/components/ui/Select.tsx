import { memo, forwardRef } from "react";

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string = string>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  options: SelectOption<T>[];
  error?: string;
  id?: string;
  className?: string;
}

export const Select = memo(
  forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { label, options, error, id: idProp, className = "", ...props },
    ref
  ) {
    const id = idProp ?? `select-${label.replace(/\s/g, "-").toLowerCase()}`;
    return (
      <div className={className}>
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`w-full rounded-lg border px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-400 ${
            error ? "border-red-500 dark:border-red-400" : "border-slate-300"
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  })
);
