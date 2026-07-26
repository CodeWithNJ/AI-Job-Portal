import Spinner from "./Spinner";

/**
 * Shared button styles, lifted from the landing page and modals so new screens
 * inherit the existing look instead of approximating it.
 *
 * - `primary`   solid indigo, for the main action on a surface
 * - `secondary` outlined, for supporting actions next to a primary
 * - `ghost`     text-only, for low-emphasis actions inside dense UI
 */
const VARIANTS = {
  primary:
    "bg-indigo-600 text-white shadow-[0_16px_28px_rgba(79,70,229,0.24)] hover:bg-indigo-700",
  secondary:
    "border border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "h-11 px-5 text-sm",
};

const Button = ({
  variant = "primary",
  size = "sm",
  type = "button",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...props}
  >
    {isLoading && <Spinner className="h-4 w-4 text-current" />}
    {children}
  </button>
);

export default Button;
