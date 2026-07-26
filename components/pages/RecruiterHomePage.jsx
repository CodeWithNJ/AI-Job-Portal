import { useAuth } from "../../src/auth/useAuth";
import { displayNameFor } from "../../src/auth/roles";
import PlaceholderDashboard from "./PlaceholderDashboard";

const CARDS = [
  {
    title: "Job Posts",
    description:
      "Create, publish, pause, and close roles with normalized fields.",
  },
  {
    title: "Applicant Pipelines",
    description:
      "Review applicants per role, ranked by fit with the evidence behind it.",
  },
  {
    title: "Talent Search",
    description:
      "Search your internal candidate pool in plain language, not keywords.",
  },
];

/**
 * Recruiters previously had no destination at all — they authenticated and
 * landed on the job seeker dashboard. This gives the role a real home so the
 * routing is honest about what exists, even while the features are pending.
 */
const RecruiterHomePage = () => {
  const { user } = useAuth();

  return (
    <PlaceholderDashboard
      eyebrow="Recruiter Dashboard"
      title={`Welcome back, ${displayNameFor(user)}!`}
      description="This is a placeholder for your hiring workspace. Soon you will post roles, review ranked applicants, and search your talent pool from here."
      gradient="from-emerald-600 via-teal-600 to-indigo-600"
      cards={CARDS}
    />
  );
};

export default RecruiterHomePage;
