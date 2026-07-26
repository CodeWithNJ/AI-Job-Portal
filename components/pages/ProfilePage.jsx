import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { extractApiErrorMessage } from "../../src/api/axiosClient";
import {
  LIMITS,
  profileCompleteness,
  toFormValues,
  toUpdatePayload,
} from "../../src/profile/profileForm";
import {
  useMyProfile,
  useUpdateProfile,
} from "../../src/profile/useProfileQueries";
import EducationSection from "../profile/EducationSection";
import ExperienceSection from "../profile/ExperienceSection";
import ResumeCard from "../profile/ResumeCard";
import SkillsInput from "../profile/SkillsInput";
import WorkPreferencesSection from "../profile/WorkPreferencesSection";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Field from "../ui/Field";
import SectionCard from "../ui/SectionCard";
import Spinner from "../ui/Spinner";
import { inputClass } from "../ui/formStyles";

const CompletenessMeter = ({ profile }) => {
  const { done, total, percent } = profileCompleteness(profile);

  return (
    <div className="w-full sm:w-64">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Profile strength
        </span>
        <span className="text-sm font-semibold text-slate-900">{percent}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        {done} of {total} sections complete
      </p>
    </div>
  );
};

const ProfilePage = () => {
  const { data, isPending, isError, error, refetch } = useMyProfile();
  const updateMutation = useUpdateProfile();
  const [savedAt, setSavedAt] = useState(null);

  const profile = data?.profile ?? null;

  // Memoised so the form only resyncs when the server record actually changes
  // — passing a fresh object every render would wipe in-progress edits.
  const formValues = useMemo(() => toFormValues(profile), [profile]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm({ mode: "onTouched", values: formValues });

  const skills = watch("skills");

  const onSubmit = async (values) => {
    setSavedAt(null);
    try {
      await updateMutation.mutateAsync(toUpdatePayload(values));
      setSavedAt(new Date());
    } catch {
      // Rendered from the mutation's error state below.
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Spinner className="h-8 w-8 text-indigo-600" />
          <p className="text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <SectionCard title="Couldn't load your profile">
        <Alert tone="error">
          {extractApiErrorMessage(
            error,
            "Something went wrong fetching your profile.",
          )}
        </Alert>
        <div className="mt-4">
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Your profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This is what matching runs on. The more precise your skills and
            experience, the more relevant the roles you'll be shown.
          </p>
        </div>
        <CompletenessMeter profile={profile} />
      </div>

      <div className="mt-8 space-y-6">
        <ResumeCard profile={profile} />

        <SectionCard
          title="Basics"
          description="A short headline and summary give the ranking model context that bullet points alone don't."
        >
          <div className="space-y-4">
            <Field
              label="Headline"
              htmlFor="headline"
              error={errors.headline?.message}
              hint="One line, as it would appear under your name"
            >
              <input
                id="headline"
                type="text"
                placeholder="Senior Backend Engineer"
                className={inputClass(Boolean(errors.headline))}
                {...register("headline", {
                  maxLength: {
                    value: LIMITS.headline,
                    message: `Keep this under ${LIMITS.headline} characters`,
                  },
                })}
              />
            </Field>

            <Field
              label="Summary"
              htmlFor="summary"
              error={errors.summary?.message}
            >
              <textarea
                id="summary"
                rows={4}
                placeholder="Eight years building distributed systems, mostly in payments..."
                className={inputClass(Boolean(errors.summary))}
                {...register("summary", {
                  maxLength: {
                    value: LIMITS.summary,
                    message: `Keep this under ${LIMITS.summary} characters`,
                  },
                })}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Location"
                htmlFor="location"
                error={errors.location?.message}
              >
                <input
                  id="location"
                  type="text"
                  placeholder="Bengaluru, IN"
                  className={inputClass(Boolean(errors.location))}
                  {...register("location", {
                    maxLength: {
                      value: LIMITS.location,
                      message: `Keep this under ${LIMITS.location} characters`,
                    },
                  })}
                />
              </Field>

              <Field
                label="Years of experience"
                htmlFor="experienceYears"
                error={errors.experienceYears?.message}
              >
                <input
                  id="experienceYears"
                  type="number"
                  min={0}
                  max={LIMITS.experienceYearsMax}
                  step="0.5"
                  placeholder="8"
                  className={inputClass(Boolean(errors.experienceYears))}
                  {...register("experienceYears", {
                    min: { value: 0, message: "Cannot be negative" },
                    max: {
                      value: LIMITS.experienceYearsMax,
                      message: `Must be ${LIMITS.experienceYearsMax} or fewer`,
                    },
                  })}
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Skills"
          description="The strongest signal in the whole profile. Add the specific tools and languages you'd want to be matched on."
        >
          <Field
            label={`Skills (${skills.length}/${LIMITS.skills})`}
            htmlFor="skills"
            hint="Press Enter or comma to add. Backspace removes the last one."
          >
            <SkillsInput
              value={skills}
              onChange={(next) =>
                setValue("skills", next, { shouldDirty: true })
              }
            />
          </Field>
        </SectionCard>

        <ExperienceSection
          control={control}
          register={register}
          errors={errors}
        />

        <EducationSection
          control={control}
          register={register}
          errors={errors}
        />

        <WorkPreferencesSection
          control={control}
          register={register}
          errors={errors}
          getValues={getValues}
        />
      </div>

      {updateMutation.isError && (
        <Alert tone="error" className="mt-6">
          {extractApiErrorMessage(
            updateMutation.error,
            "Could not save your profile. Please try again.",
          )}
        </Alert>
      )}

      {/*
        Sticky rather than pinned to the bottom of the document: this form is
        long enough that a save button at the end would be several screens away
        from whatever the user just edited.
      */}
      <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/95 px-6 py-4 shadow-lg backdrop-blur">
        <p className="text-sm text-slate-600">
          {isDirty
            ? "You have unsaved changes."
            : savedAt
              ? `Saved at ${savedAt.toLocaleTimeString()}`
              : "Everything is up to date."}
        </p>
        <Button
          type="submit"
          size="md"
          isLoading={updateMutation.isPending}
          disabled={!isDirty}
        >
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default ProfilePage;
