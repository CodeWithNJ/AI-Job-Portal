import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../src/api/authApi";
import { extractApiErrorMessage } from "../src/api/axiosClient";
import Spinner from "./ui/Spinner";
import { inputClass } from "./ui/formStyles";

const loginHighlights = [
  "Resume parsed into skills, experience, and job signals",
  "Role matching on relevance, not just exact keywords",
  "Clear fit explanations before you apply",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Thin wrapper that controls visibility. Mounting/unmounting LoginModalContent
// on isOpen toggles gives us a clean state reset for free without having to
// imperatively setState inside an effect.
const LoginModal = ({ isOpen, onClose, onRegisterClick, onLoginSuccess }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <LoginModalContent
      onClose={onClose}
      onRegisterClick={onRegisterClick}
      onLoginSuccess={onLoginSuccess}
    />
  );
};

const LoginModalContent = ({ onClose, onRegisterClick, onLoginSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Lock body scroll while the modal is mounted so the page behind the
  // overlay doesn't keep its own scrollbar visible (which produced the
  // double-scrollbar look).
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const onSubmit = async (values) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      // The Nest response interceptor wraps payloads as
      // { success, statusCode, message, data: { user } }.
      const user = response?.data?.user ?? null;

      setSuccessMessage(response?.message || "Signed in successfully.");

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      setServerError(
        extractApiErrorMessage(error, "Unable to sign in. Please try again."),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      {/*
        max-h-full tracks the overlay's own responsive padding (p-4 / sm:p-6)
        instead of hard-coding it, and grid-rows-[minmax(0,1fr)] clamps the row
        track to that height. Without the clamped track the row is sized to its
        content, so the panel below never shrinks and its overflow-y-auto stays
        inert — anything past the cap (the register link, once a server error
        banner appears) gets silently clipped by overflow-hidden.
      */}
      <div
        className="relative grid max-h-full w-full max-w-5xl grid-rows-[minmax(0,1fr)] overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:grid-cols-[0.9fr_1.1fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900 hover:cursor-pointer"
          aria-label="Close login modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.28 3.22a.75.75 0 0 0-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 1 0 1.06 1.06L10 11.06l5.72 5.72a.75.75 0 1 0 1.06-1.06L11.06 10l5.72-5.72a.75.75 0 0 0-1.06-1.06L10 8.94 4.28 3.22Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="hidden flex-col justify-center bg-linear-to-br from-indigo-700 via-indigo-600 to-sky-500 px-8 py-8 text-white lg:flex lg:px-10 lg:py-10">
          <div className="max-w-sm">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
              Smart job matching
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight xl:text-3xl xl:leading-[1.1]">
              Find roles that actually match your experience.
            </h2>

            <p className="mt-3 text-sm leading-6 text-indigo-100">
              Sign in to upload your resume, unlock relevance-first job
              matching, and see why each role fits your background.
            </p>

            <div className="mt-6 space-y-3">
              {loginHighlights.map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/12 text-xs font-semibold text-white">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-6 text-indigo-50">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/15 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                Why this flow works
              </p>
              <p className="mt-2 text-sm leading-6 text-indigo-50">
                Upload once, get parsed insights, and come back to fresh
                job recommendations whenever you sign in.
              </p>
            </div>
          </div>
        </div>

        {/* min-h-0 overrides the grid item's automatic minimum size, which is
            what actually lets this column shrink and scroll. */}
        <div className="min-h-0 overflow-y-auto bg-white px-6 py-7 sm:px-10 sm:py-9">
          <div className="mx-auto w-full max-w-md">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Welcome back
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Sign in to continue
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload your resume and move straight into smarter job discovery.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className={inputClass(Boolean(errors.email))}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className={inputClass(Boolean(errors.password))}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    {...register("rememberMe")}
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Forgot password?
                </button>
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700"
                >
                  {serverError}
                </div>
              )}

              {successMessage && !serverError && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(79,70,229,0.24)] transition hover:bg-indigo-700 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting && <Spinner className="h-4 w-4 text-white" />}
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:cursor-pointer"
                >
                  Register Now
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
