import { useFieldArray } from "react-hook-form";
import { EMPTY_EXPERIENCE, LIMITS } from "../../src/profile/profileForm";
import Field from "../ui/Field";
import SectionCard from "../ui/SectionCard";
import { inputClass } from "../ui/formStyles";
import { EntryCard, EntryList } from "./RepeatableEntry";

const ExperienceSection = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <SectionCard
      title="Work experience"
      description="Roles you've held. Titles and companies carry most of the signal when matching you to a job description."
    >
      <EntryList
        items={fields}
        emptyMessage="No roles added yet. Add your most recent position first."
        addLabel="Add a role"
        onAdd={() => append(EMPTY_EXPERIENCE)}
        canAdd={fields.length < LIMITS.experienceEntries}
        limitMessage={`Limit of ${LIMITS.experienceEntries} roles reached.`}
      >
        <div className="space-y-4">
          {fields.map((field, index) => {
            const entryErrors = errors?.experience?.[index] ?? {};

            return (
              <EntryCard
                key={field.id}
                index={index}
                label="Role"
                onRemove={() => remove(index)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Job title"
                    htmlFor={`experience.${index}.title`}
                    error={entryErrors.title?.message}
                  >
                    <input
                      id={`experience.${index}.title`}
                      type="text"
                      placeholder="Backend Engineer"
                      className={inputClass(Boolean(entryErrors.title))}
                      {...register(`experience.${index}.title`, {
                        required: "Job title is required",
                        maxLength: {
                          value: LIMITS.entryTitle,
                          message: `Keep this under ${LIMITS.entryTitle} characters`,
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Company"
                    htmlFor={`experience.${index}.company`}
                    error={entryErrors.company?.message}
                  >
                    <input
                      id={`experience.${index}.company`}
                      type="text"
                      placeholder="Acme Corp"
                      className={inputClass(Boolean(entryErrors.company))}
                      {...register(`experience.${index}.company`, {
                        required: "Company is required",
                        maxLength: {
                          value: LIMITS.entryTitle,
                          message: `Keep this under ${LIMITS.entryTitle} characters`,
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Started"
                    htmlFor={`experience.${index}.startDate`}
                    error={entryErrors.startDate?.message}
                    hint="Any format — 2021-04 or Apr 2021"
                  >
                    <input
                      id={`experience.${index}.startDate`}
                      type="text"
                      placeholder="2021-04"
                      className={inputClass(Boolean(entryErrors.startDate))}
                      {...register(`experience.${index}.startDate`, {
                        maxLength: {
                          value: LIMITS.entryDate,
                          message: "That date looks too long",
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Ended"
                    htmlFor={`experience.${index}.endDate`}
                    error={entryErrors.endDate?.message}
                    hint="Leave blank if this is your current role"
                  >
                    <input
                      id={`experience.${index}.endDate`}
                      type="text"
                      placeholder="Present"
                      className={inputClass(Boolean(entryErrors.endDate))}
                      {...register(`experience.${index}.endDate`, {
                        maxLength: {
                          value: LIMITS.entryDate,
                          message: "That date looks too long",
                        },
                      })}
                    />
                  </Field>
                </div>

                <Field
                  label="What you did"
                  htmlFor={`experience.${index}.description`}
                  error={entryErrors.description?.message}
                  className="mt-4"
                >
                  <textarea
                    id={`experience.${index}.description`}
                    rows={3}
                    placeholder="Owned the payments service end to end..."
                    className={inputClass(Boolean(entryErrors.description))}
                    {...register(`experience.${index}.description`, {
                      maxLength: {
                        value: LIMITS.entryDescription,
                        message: `Keep this under ${LIMITS.entryDescription} characters`,
                      },
                    })}
                  />
                </Field>
              </EntryCard>
            );
          })}
        </div>
      </EntryList>
    </SectionCard>
  );
};

export default ExperienceSection;
