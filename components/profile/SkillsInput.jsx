import { useState } from "react";
import { LIMITS } from "../../src/profile/profileForm";
import { inputClass } from "../ui/formStyles";

/**
 * Tag-style editor for the skills array.
 *
 * Skills are the field retrieval relevance leans on hardest, so entry is kept
 * frictionless: Enter or comma commits, Backspace on an empty box removes the
 * last tag, and duplicates are folded case-insensitively rather than rejected
 * with an error the user has to read.
 */
const SkillsInput = ({ value = [], onChange, error }) => {
  const [draft, setDraft] = useState("");

  const atLimit = value.length >= LIMITS.skills;

  const commit = (raw) => {
    const skill = raw.trim();
    if (!skill) return;

    const isDuplicate = value.some(
      (existing) => existing.toLowerCase() === skill.toLowerCase(),
    );
    if (isDuplicate || atLimit) {
      setDraft("");
      return;
    }

    onChange([...value, skill.slice(0, LIMITS.skill)]);
    setDraft("");
  };

  const removeAt = (index) => onChange(value.filter((_, i) => i !== index));

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      // Enter inside a form would submit it; commit the tag instead.
      event.preventDefault();
      commit(draft);
      return;
    }

    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeAt(value.length - 1);
    }
  };

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-2.5 flex flex-wrap gap-2">
          {value.map((skill, index) => (
            <li
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 py-1 pl-3 pr-1.5 text-sm font-medium text-indigo-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${skill}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-indigo-400 transition hover:bg-indigo-100 hover:text-indigo-700 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.28 3.22a.75.75 0 0 0-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 1 0 1.06 1.06L10 11.06l5.72 5.72a.75.75 0 1 0 1.06-1.06L11.06 10l5.72-5.72a.75.75 0 0 0-1.06-1.06L10 8.94 4.28 3.22Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        id="skills"
        type="text"
        value={draft}
        disabled={atLimit}
        maxLength={LIMITS.skill}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        // Commit whatever is half-typed when focus leaves, so a skill isn't
        // silently lost by clicking Save with text still in the box.
        onBlur={() => commit(draft)}
        placeholder={
          atLimit
            ? `Skill limit reached (${LIMITS.skills})`
            : "Type a skill and press Enter"
        }
        className={inputClass(Boolean(error))}
      />
    </div>
  );
};

export default SkillsInput;
