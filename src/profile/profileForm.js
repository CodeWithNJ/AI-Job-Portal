/**
 * Translation between the API's profile shape and the form's.
 *
 * Kept as pure functions away from the component because the mapping is where
 * the sharp edges live: the API rejects unknown properties outright
 * (`forbidNonWhitelisted`), and a blank input must become "field omitted"
 * rather than `""` or `NaN` for anything numeric or enum-backed.
 */

/** Limits mirrored from the backend DTO so the user sees them before the API does. */
export const LIMITS = {
  headline: 255,
  summary: 5000,
  location: 255,
  skill: 100,
  skills: 50,
  experienceEntries: 30,
  educationEntries: 10,
  experienceYearsMax: 60,
  noticePeriodDaysMax: 365,
  jobTypes: 10,
  entryTitle: 150,
  entryDate: 30,
  entryDescription: 2000,
  expectedCompensation: 100,
};

export const REMOTE_PREFERENCES = [
  { value: "", label: "No preference set" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "any", label: "Open to any" },
];

export const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

export const EMPTY_EXPERIENCE = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
};

export const EMPTY_EDUCATION = { degree: "", institution: "", year: "" };

/** API profile → form values. Every field becomes a controlled, defined value. */
export const toFormValues = (profile) => ({
  headline: profile?.headline ?? "",
  summary: profile?.summary ?? "",
  location: profile?.location ?? "",
  experienceYears:
    profile?.experienceYears === null || profile?.experienceYears === undefined
      ? ""
      : String(profile.experienceYears),
  skills: Array.isArray(profile?.skills) ? profile.skills : [],
  experience: Array.isArray(profile?.experience)
    ? profile.experience.map((entry) => ({ ...EMPTY_EXPERIENCE, ...entry }))
    : [],
  education: Array.isArray(profile?.education)
    ? profile.education.map((entry) => ({ ...EMPTY_EDUCATION, ...entry }))
    : [],
  workPreferences: {
    jobTypes: profile?.workPreferences?.jobTypes ?? [],
    remotePreference: profile?.workPreferences?.remotePreference ?? "",
    expectedCompensation: profile?.workPreferences?.expectedCompensation ?? "",
    noticePeriodDays:
      profile?.workPreferences?.noticePeriodDays === null ||
      profile?.workPreferences?.noticePeriodDays === undefined
        ? ""
        : String(profile.workPreferences.noticePeriodDays),
  },
});

const trimmed = (value) => (typeof value === "string" ? value.trim() : value);

/**
 * Form values → PATCH payload.
 *
 * Text fields are sent even when empty, because clearing a headline is a real
 * edit the user expects to persist. Numeric and enum fields are *omitted* when
 * blank instead: `""` fails `@IsIn`/`@IsInt` on the API, and with implicit
 * conversion enabled it would otherwise arrive as `0` and silently write a
 * wrong value.
 */
export const toUpdatePayload = (values) => {
  const payload = {
    headline: trimmed(values.headline),
    summary: trimmed(values.summary),
    location: trimmed(values.location),
    skills: values.skills.map(trimmed).filter(Boolean),
    experience: values.experience.map((entry) => {
      const mapped = {
        title: trimmed(entry.title),
        company: trimmed(entry.company),
      };
      // Optional strings are dropped when blank so we don't store "" for a
      // date the user never filled in.
      if (trimmed(entry.startDate)) mapped.startDate = trimmed(entry.startDate);
      if (trimmed(entry.endDate)) mapped.endDate = trimmed(entry.endDate);
      if (trimmed(entry.description)) {
        mapped.description = trimmed(entry.description);
      }
      return mapped;
    }),
    education: values.education.map((entry) => {
      const mapped = {
        degree: trimmed(entry.degree),
        institution: trimmed(entry.institution),
      };
      if (trimmed(entry.year)) mapped.year = trimmed(entry.year);
      return mapped;
    }),
  };

  if (values.experienceYears !== "") {
    payload.experienceYears = Number(values.experienceYears);
  }

  const preferences = {};
  const { workPreferences } = values;

  if (workPreferences.jobTypes.length > 0) {
    preferences.jobTypes = workPreferences.jobTypes;
  }
  if (workPreferences.remotePreference) {
    preferences.remotePreference = workPreferences.remotePreference;
  }
  if (trimmed(workPreferences.expectedCompensation)) {
    preferences.expectedCompensation = trimmed(
      workPreferences.expectedCompensation,
    );
  }
  if (workPreferences.noticePeriodDays !== "") {
    preferences.noticePeriodDays = Number(workPreferences.noticePeriodDays);
  }

  // Send the object only when it carries something. An empty object is a valid
  // no-op, but omitting it keeps the request honest about what changed.
  if (Object.keys(preferences).length > 0) {
    payload.workPreferences = preferences;
  }

  return payload;
};

/**
 * Rough completeness signal for the profile header. Not a backend concept —
 * it exists to give the user a reason to finish, which is the PRD's activation
 * metric (profile completed plus resume uploaded).
 */
export const profileCompleteness = (profile) => {
  const checks = [
    Boolean(profile?.headline),
    Boolean(profile?.summary),
    Boolean(profile?.location),
    (profile?.skills?.length ?? 0) > 0,
    (profile?.experience?.length ?? 0) > 0,
    (profile?.education?.length ?? 0) > 0,
    Boolean(profile?.resumeUrl),
  ];

  const done = checks.filter(Boolean).length;
  return { done, total: checks.length, percent: Math.round((done / checks.length) * 100) };
};
