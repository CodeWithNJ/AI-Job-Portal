import axios from "axios";
import axiosClient from "./axiosClient";

/** Resume types the backend accepts, mapped to a label for the UI. */
export const RESUME_MIME_TYPES = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
};

/** Mirrors MAX_RESUME_SIZE_MB on the API. */
// export const MAX_RESUME_MB = 10;
export const maxResumeSize = Number(import.meta.env.VITE_MAX_RESUME_MB) || 5;

/** GET /profiles/me → `{ role, profile }`; the API creates the row on first read. */
export const fetchMyProfile = async () => {
  const response = await axiosClient.get("/profiles/me");
  return response.data?.data ?? null;
};

/** PATCH /profiles/me — partial update, validated against the caller's role. */
export const updateMyProfile = async (payload) => {
  const response = await axiosClient.patch("/profiles/me", payload);
  return response.data?.data ?? null;
};

/** Step 1 of the upload: ask for a short-lived signed URL bound to this file. */
export const createResumeUploadUrl = async ({ fileName, mimeType }) => {
  const response = await axiosClient.post("/profiles/me/resume/upload-url", {
    fileName,
    mimeType,
  });
  return response.data?.data;
};

/**
 * Step 2: PUT the bytes at the signed URL.
 *
 * Deliberately a bare axios call rather than `axiosClient`. The signed token in
 * the path is the credential, so this request must not carry our auth cookies,
 * and the Content-Type has to be exactly the one the URL was issued for — the
 * shared client's JSON default would make the API reject it with a 415.
 */
export const uploadResumeToSignedUrl = ({
  uploadUrl,
  headers,
  file,
  onProgress,
}) =>
  axios.put(uploadUrl, file, {
    headers,
    withCredentials: false,
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

/** Both steps as one call, since the UI never wants half an upload. */
export const uploadResume = async ({ file, onProgress }) => {
  const ticket = await createResumeUploadUrl({
    fileName: file.name,
    mimeType: file.type,
  });

  await uploadResumeToSignedUrl({
    uploadUrl: ticket.uploadUrl,
    headers: ticket.headers,
    file,
    onProgress,
  });

  return ticket;
};
