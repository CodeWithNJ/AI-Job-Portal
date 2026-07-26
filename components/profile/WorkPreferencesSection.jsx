import { Controller } from "react-hook-form";
import {
  JOB_TYPES,
  LIMITS,
  REMOTE_PREFERENCES,
} from "../../src/profile/profileForm";
import Field from "../ui/Field";
import SectionCard from "../ui/SectionCard";
import { inputClass, labelClass } from "../ui/formStyles";

/**
 * Preferences double as hard filters on the retrieval side — location,
 * compensation band, and notice period are exactly the constraints the PRD
 * wants applied *before* semantic ranking, so they're worth collecting even
 * while recommendations don't exist yet.
 */
const WorkPreferencesSection = ({ control, register, errors, getValues }) => {
  const preferenceErrors = errors?.workPreferences ?? {};

  /**
   * Reads the live form store rather than the value captured in this render.
   * Two toggles clicked before React re-renders would otherwise both see the
   * same stale array, and the second click would drop the first selection.
   */
  const toggleJobType = (field, value) => {
    const current = getValues("workPreferences.jobTypes") ?? field.value ?? [];
    field.onChange(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  return (
    <SectionCard
      title="Work preferences"
      description="Used as filters, not suggestions — roles outside these bounds won't be recommended to you."
    >
      <Controller
        control={control}
        name="workPreferences.jobTypes"
        render={({ field }) => (
          <div>
            <span className={labelClass}>Open to</span>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => {
                const selected = field.value.includes(type.value);
                const atLimit =
                  !selected && field.value.length >= LIMITS.jobTypes;

                return (
                  <button
                    key={type.value}
                    type="button"
                    disabled={atLimit}
                    onClick={() => toggleJobType(field, type.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-300 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                    aria-pressed={selected}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Location preference" htmlFor="remotePreference">
          <select
            id="remotePreference"
            className={inputClass(false)}
            {...register("workPreferences.remotePreference")}
          >
            {REMOTE_PREFERENCES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Expected compensation"
          htmlFor="expectedCompensation"
          error={preferenceErrors.expectedCompensation?.message}
          hint="Free text — a range is fine"
        >
          <input
            id="expectedCompensation"
            type="text"
            placeholder="45-55 LPA"
            className={inputClass(
              Boolean(preferenceErrors.expectedCompensation),
            )}
            {...register("workPreferences.expectedCompensation", {
              maxLength: {
                value: LIMITS.expectedCompensation,
                message: `Keep this under ${LIMITS.expectedCompensation} characters`,
              },
            })}
          />
        </Field>

        <Field
          label="Notice period (days)"
          htmlFor="noticePeriodDays"
          error={preferenceErrors.noticePeriodDays?.message}
        >
          <input
            id="noticePeriodDays"
            type="number"
            min={0}
            max={LIMITS.noticePeriodDaysMax}
            placeholder="30"
            className={inputClass(Boolean(preferenceErrors.noticePeriodDays))}
            {...register("workPreferences.noticePeriodDays", {
              min: { value: 0, message: "Cannot be negative" },
              max: {
                value: LIMITS.noticePeriodDaysMax,
                message: `Must be ${LIMITS.noticePeriodDaysMax} days or fewer`,
              },
              validate: (value) =>
                value === "" ||
                Number.isInteger(Number(value)) ||
                "Enter a whole number of days",
            })}
          />
        </Field>
      </div>
    </SectionCard>
  );
};

export default WorkPreferencesSection;
