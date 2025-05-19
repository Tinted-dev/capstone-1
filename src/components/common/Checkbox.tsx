import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className="mb-3">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            ref={ref}
            className={`form-checkbox h-5 w-5 text-green-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${className}`}
            {...rest}
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>
        </label>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

export default Checkbox;