import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../src/api/authApi";
import { extractApiErrorMessage } from "../src/api/axiosClient";

const loginHighlights = [
  "Resume parsed into skills, experience, and job signals",
  "Role matching based on relevance, not just exact keywords",
  "Clear fit explanations before you spend time applying",
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

  const onSubmit = async (values) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
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

  const inputClass = (hasError) =>
    `w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className="relative grid w-full max-w-240 overflow-hidden rounded-4xl border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:grid-cols-[0.9fr_1.1fr]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900 hover:cursor-pointer"
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

          <div className="flex flex-col justify-center bg-linear-to-br from-indigo-700 via-indigo-600 to-sky-500 px-7 py-8 text-white sm:px-10 sm:py-10 lg:min-h-[620px]">
            <div className="max-w-sm">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                Smart job matching
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-[42px] sm:leading-[1.05]">
                Find roles that actually match your experience.
              </h2>

              <p className="mt-4 text-sm leading-7 text-indigo-100 sm:text-base">
                Sign in to upload your resume, unlock relevance-first job
                matching, and see why each opportunity fits your background.
              </p>

              <div className="mt-8 space-y-4">
                {loginHighlights.map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/12 text-sm font-semibold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-indigo-50 sm:text-[15px]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                  Why this flow works
                </p>
                <p className="mt-3 text-sm leading-7 text-indigo-50">
                  Upload once, get parsed insights, and come back directly to
                  job recommendations whenever you sign in again.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-white px-7 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto w-full max-w-md">
              <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Welcome back
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
                Sign in to continue
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Upload your resume and move straight into smarter job discovery.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
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
                    <p className="mt-2 text-xs font-medium text-rose-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
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
                    <p className="mt-2 text-xs font-medium text-rose-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-3 text-sm text-slate-600">
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
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {serverError}
                  </div>
                )}

                {successMessage && !serverError && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(79,70,229,0.24)] transition hover:bg-indigo-700 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting && (
                    <svg
                      className="h-4 w-4 animate-spin text-white"
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
                  )}
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-5">
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
    </div>
  );
};

export default LoginModal;
