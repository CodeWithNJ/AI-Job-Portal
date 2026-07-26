/**
 * The app's single spinner. Size and colour come from `className` so it can
 * sit inside a button (`h-4 w-4 text-white`) or stand alone on a loading
 * screen (`h-8 w-8 text-indigo-600`) without forking the markup.
 */
const Spinner = ({ className = "h-4 w-4 text-current" }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
    />
  </svg>
);

export default Spinner;
