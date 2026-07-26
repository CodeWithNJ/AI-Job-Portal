import { useFieldArray } from "react-hook-form";
import { EMPTY_EDUCATION, LIMITS } from "../../src/profile/profileForm";
import Field from "../ui/Field";
import SectionCard from "../ui/SectionCard";
import { inputClass } from "../ui/formStyles";
import { EntryCard, EntryList } from "./RepeatableEntry";

const EducationSection = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <SectionCard
      title="Education"
      description="Degrees and certifications. Used as supporting evidence when a role lists formal requirements."
    >
      <EntryList
        items={fields}
        emptyMessage="No education added yet."
        addLabel="Add education"
        onAdd={() => append(EMPTY_EDUCATION)}
        canAdd={fields.length < LIMITS.educationEntries}
        limitMessage={`Limit of ${LIMITS.educationEntries} entries reached.`}
      >
        <div className="space-y-4">
          {fields.map((field, index) => {
            const entryErrors = errors?.education?.[index] ?? {};

            return (
              <EntryCard
                key={field.id}
                index={index}
                label="Education"
                onRemove={() => remove(index)}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Degree"
                    htmlFor={`education.${index}.degree`}
                    error={entryErrors.degree?.message}
                  >
                    <input
                      id={`education.${index}.degree`}
                      type="text"
                      placeholder="B.Tech, Computer Science"
                      className={inputClass(Boolean(entryErrors.degree))}
                      {...register(`education.${index}.degree`, {
                        required: "Degree is required",
                        maxLength: {
                          value: LIMITS.entryTitle,
                          message: `Keep this under ${LIMITS.entryTitle} characters`,
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Institution"
                    htmlFor={`education.${index}.institution`}
                    error={entryErrors.institution?.message}
                  >
                    <input
                      id={`education.${index}.institution`}
                      type="text"
                      placeholder="NIT Trichy"
                      className={inputClass(Boolean(entryErrors.institution))}
                      {...register(`education.${index}.institution`, {
                        required: "Institution is required",
                        maxLength: {
                          value: LIMITS.entryTitle,
                          message: `Keep this under ${LIMITS.entryTitle} characters`,
                        },
                      })}
                    />
                  </Field>

                  <Field
                    label="Year"
                    htmlFor={`education.${index}.year`}
                    error={entryErrors.year?.message}
                  >
                    <input
                      id={`education.${index}.year`}
                      type="text"
                      placeholder="2017"
                      className={inputClass(Boolean(entryErrors.year))}
                      {...register(`education.${index}.year`, {
                        maxLength: {
                          value: LIMITS.entryDate,
                          message: "That year looks too long",
                        },
                      })}
                    />
                  </Field>
                </div>
              </EntryCard>
            );
          })}
        </div>
      </EntryList>
    </SectionCard>
  );
};

export default EducationSection;
