import { errorTextClass, hintTextClass, labelClass } from "./formStyles";

/**
 * Label + control + hint/error, in the order and spacing the modals already
 * use. The hint is hidden while an error is showing so the two never stack and
 * push the form around.
 */
const Field = ({ label, htmlFor, error, hint, className = "", children }) => (
  <div className={className}>
    {label && (
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
    )}
    {children}
    {error ? (
      <p className={errorTextClass}>{error}</p>
    ) : hint ? (
      <p className={hintTextClass}>{hint}</p>
    ) : null}
  </div>
);

export default Field;
