import { AlertIcon } from './Icons';

export const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  id,
}) => {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-ui font-medium text-stone-700 dark:text-stone-300 mb-2"
      >
        {label}
        {required && (
          <span className="ml-1 text-amber-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : undefined}
        className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-ui text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
      />
    </div>
  );
};

export const TextareaField = ({ label, value, onChange, placeholder, rows = 8, hint, id }) => {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-ui font-medium text-stone-700 dark:text-stone-300 mb-2"
      >
        {label}
        {hint && (
          <span className="ml-1.5 font-normal text-stone-400">{hint}</span>
        )}
      </label>
      <textarea
        id={fieldId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-ui text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all font-body"
      />
    </div>
  );
};

export const SubmitButton = ({ loading, label, loadingLabel, disabled }) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-ui font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
  >
    {loading ? (
      <>
        <div
          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
          role="status"
          aria-label={loadingLabel}
        />
        {loadingLabel}
      </>
    ) : (
      label
    )}
  </button>
);

export const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-sm font-ui flex items-start gap-2.5"
    >
      <AlertIcon />
      {message}
    </div>
  );
};