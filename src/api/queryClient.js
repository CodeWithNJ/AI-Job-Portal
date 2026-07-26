import { QueryClient } from "@tanstack/react-query";

// Status codes where retrying is pointless: the request was understood and
// refused. A 401 in particular is already handled by the axios interceptor,
// which attempts a silent refresh and replays the request once — retrying here
// on top of that would multiply requests against an already-rotated token.
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 422]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status && NON_RETRYABLE_STATUSES.has(status)) {
          return false;
        }
        return failureCount < 2;
      },
      // Screens in this app read slow-moving data (profiles, job posts), so a
      // short staleness window avoids a refetch storm when several components
      // mount at once without serving genuinely old data.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
