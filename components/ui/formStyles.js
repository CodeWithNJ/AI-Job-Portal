/**
 * Form styling shared by the auth modals and the profile editor.
 *
 * These exact classes were previously duplicated as a local `inputClass` helper
 * inside each modal. Centralising them is what keeps a field on the profile
 * page indistinguishable from a field in the sign-up dialog.
 */

export const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500";

export const errorTextClass = "mt-1.5 text-xs font-medium text-rose-600";

export const hintTextClass = "mt-1.5 text-xs text-slate-500";

export const inputClass = (hasError) =>
  `w-full rounded-2xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
  }`;
