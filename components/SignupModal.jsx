import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { signupUser } from "../src/api/authApi";
import { extractApiErrorMessage } from "../src/api/axiosClient";

const signupHighlights = [
  "Matched to roles based on your real experience",
  "AI parses your resume into a structured profile",
  "Track every application in one place",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Thin wrapper that controls visibility. Mounting/unmounting
// SignupModalContent on isOpen toggles guarantees fresh internal state
// (form values, error/success banners) every time the modal is reopened.
const SignupModal = ({ isOpen, onClose, onSignInClick, onSignupSuccess }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <SignupModalContent
      onClose={onClose}
      onSignInClick={onSignInClick}
      onSignupSuccess={onSignupSuccess}
    />
  );
};

const SignupModalContent = ({ onClose, onSignInClick, onSignupSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "job_seeker",
      acceptTerms: false,
    },
  });

  const selectedRole = watch("role");
  const passwordValue = watch("password");

  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const redirectTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

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
      // The backend CreateUserDto does not accept fullName/confirmPassword and
      // the global ValidationPipe runs with forbidNonWhitelisted: true, so we
      // only send the fields it expects.
      await signupUser({
        email: values.email,
        password: values.password,
        role: values.role,
      });

      setSuccessMessage(
        "Account created successfully. Redirecting you to sign in...",
      );

      // Brief delay so the success state is visible before switching to the
      // login modal.
      redirectTimer.current = setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess();
        } else if (onSignInClick) {
          onSignInClick();
        }
      }, 900);
    } catch (error) {
      setServerError(
        extractApiErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
      );
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-2xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:grid-cols-[0.9fr_1.1fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900 hover:cursor-pointer"
          aria-label="Close signup modal"
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

        <div className="hidden flex-col justify-center bg-linear-to-br from-emerald-600 via-teal-600 to-indigo-600 px-8 py-8 text-white lg:flex lg:px-10 lg:py-10">
          <div className="max-w-sm">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50">
              Create your account
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight xl:text-3xl xl:leading-[1.1]">
              Build a profile recruiters can actually understand.
            </h2>

            <p className="mt-3 text-sm leading-6 text-emerald-50/90">
              Join in under a minute. Upload your resume once and we’ll keep
              matching you with relevant roles every week.
            </p>

            <div className="mt-6 space-y-3">
              {signupHighlights.map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/12 text-xs font-semibold text-white">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-6 text-emerald-50">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/15 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50">
                Free for job seekers
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                No credit card required. Your resume and profile data stay
                private until you choose to apply.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto bg-white px-6 py-7 sm:px-10 sm:py-8">
          <div className="mx-auto w-full max-w-md">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Get started
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Set up your profile to unlock relevance-first job matching.
            </p>

            <form
              className="mt-5 space-y-3.5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  className={inputClass(Boolean(errors.fullName))}
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 60,
                      message: "Name must be 60 characters or less",
                    },
                  })}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  Email Address
                </label>
                <input
                  id="signup-email"
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

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="signup-password"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="At least 3 characters"
                    autoComplete="new-password"
                    aria-invalid={errors.password ? "true" : "false"}
                    className={inputClass(Boolean(errors.password))}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 3,
                        message: "Use at least 3 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    Confirm
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    className={inputClass(Boolean(errors.confirmPassword))}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex cursor-pointer flex-col rounded-2xl border px-3 py-2.5 transition ${
                      selectedRole === "job_seeker"
                        ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="job_seeker"
                      className="sr-only"
                      {...register("role", {
                        required: "Select an account type",
                      })}
                    />
                    <span className="text-sm font-semibold text-slate-900">
                      Job Seeker
                    </span>
                    <span className="mt-0.5 text-xs text-slate-500">
                      Looking for a role
                    </span>
                  </label>

                  <label
                    className="flex cursor-not-allowed flex-col rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2.5 opacity-60"
                    title="Recruiter signup coming soon"
                  >
                    <input
                      type="radio"
                      value="recruiter"
                      disabled
                      className="sr-only"
                      {...register("role")}
                    />
                    <span className="text-sm font-semibold text-slate-500">
                      Recruiter
                    </span>
                    <span className="mt-0.5 text-xs text-slate-400">
                      Coming soon
                    </span>
                  </label>
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    aria-invalid={errors.acceptTerms ? "true" : "false"}
                    {...register("acceptTerms", {
                      required: "You must accept the terms to continue",
                    })}
                  />
                  <span className="leading-5">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.acceptTerms.message}
                  </p>
                )}
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
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSignInClick}
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
