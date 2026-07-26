import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyProfile, updateMyProfile, uploadResume } from "../api/profileApi";

export const PROFILE_QUERY_KEY = ["profile", "me"];

/** The caller's own profile. The API creates an empty row on first read. */
export const useMyProfile = () =>
  useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchMyProfile,
  });

/**
 * Saves the profile and writes the response straight into the cache — the
 * PATCH returns the updated record, so refetching would be a wasted round trip.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => queryClient.setQueryData(PROFILE_QUERY_KEY, data),
  });
};

/**
 * Runs the two-step signed-URL upload. The PUT responds with file metadata
 * rather than the full profile, so this invalidates instead of seeding — the
 * refetch also picks up the parse status the upload resets.
 */
export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
};
