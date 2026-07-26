import { useRef, useState } from "react";
import { extractApiErrorMessage } from "../../src/api/axiosClient";
import { MAX_RESUME_MB, RESUME_MIME_TYPES } from "../../src/api/profileApi";
import { useUploadResume } from "../../src/profile/useProfileQueries";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import SectionCard from "../ui/SectionCard";

/** Honest labels for the parse pipeline, which is not built yet. */
const PARSE_STATUS = {
  not_started: { label: "Not parsed yet", tone: "text-slate-500" },
  pending: { label: "Queued for parsing", tone: "text-amber-600" },
  processing: { label: "Parsing now", tone: "text-amber-600" },
  completed: { label: "Parsed", tone: "text-emerald-600" },
  failed: { label: "Parsing failed", tone: "text-rose-600" },
};

const ACCEPTED = Object.keys(RESUME_MIME_TYPES);

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const ResumeCard = ({ profile }) => {
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState(null);
  const [justUploaded, setJustUploaded] = useState(false);

  const uploadMutation = useUploadResume();

  const hasResume = Boolean(profile?.resumeUrl);
  const parseStatus =
    PARSE_STATUS[profile?.resumeParseStatus] ?? PARSE_STATUS.not_started;

  const handleFile = async (file) => {
    if (!file) return;

    setLocalError(null);
    setJustUploaded(false);

    // Client-side checks are courtesy only — the API re-validates the declared
    // type, the size, and the file's magic bytes before storing anything.
    if (!ACCEPTED.includes(file.type)) {
      setLocalError("Only PDF and DOCX resumes are supported.");
      return;
    }
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setLocalError(`That file is over the ${MAX_RESUME_MB}MB limit.`);
      return;
    }

    setProgress(0);
    try {
      await uploadMutation.mutateAsync({ file, onProgress: setProgress });
      setJustUploaded(true);
    } catch {
      // Surfaced from the mutation's error below.
    }
  };

  const onInputChange = (event) => {
    const [file] = event.target.files ?? [];
    void handleFile(file);
    // Reset so picking the same file twice still fires a change event.
    event.target.value = "";
  };

  const isUploading = uploadMutation.isPending;

  return (
    <SectionCard
      title="Resume"
      description="Upload once. We parse it into structured skills and experience — every extracted value stays editable, and nothing is shared with recruiters until you apply."
      actions={
        <Button
          onClick={() => fileInputRef.current?.click()}
          isLoading={isUploading}
          variant={hasResume ? "secondary" : "primary"}
        >
          {isUploading
            ? "Uploading..."
            : hasResume
              ? "Replace resume"
              : "Upload resume"}
        </Button>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={onInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {hasResume ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-semibold text-indigo-700">
              {RESUME_MIME_TYPES[profile.resumeMimeType] ?? "FILE"}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {profile.resumeFileName ?? "Resume"}
              </p>
              <p className="text-xs text-slate-500">
                Uploaded {formatDate(profile.resumeUploadedAt) ?? "recently"}
              </p>
            </div>
          </div>
          <p className={`text-xs font-medium ${parseStatus.tone}`}>
            {parseStatus.label}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:cursor-pointer"
        >
          <p className="text-sm font-medium text-slate-700">
            No resume uploaded yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            PDF or DOCX, up to {MAX_RESUME_MB}MB
          </p>
        </button>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{progress}% uploaded</p>
        </div>
      )}

      {localError && (
        <Alert tone="error" className="mt-4">
          {localError}
        </Alert>
      )}

      {uploadMutation.isError && !localError && (
        <Alert tone="error" className="mt-4">
          {extractApiErrorMessage(
            uploadMutation.error,
            "Could not upload your resume. Please try again.",
          )}
        </Alert>
      )}

      {justUploaded && !uploadMutation.isError && (
        <Alert tone="success" className="mt-4">
          Resume uploaded. Parsing will pre-fill your profile once it runs.
        </Alert>
      )}
    </SectionCard>
  );
};

export default ResumeCard;
