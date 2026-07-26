import { useAuth } from "../../src/auth/useAuth";
import { displayNameFor } from "../../src/auth/roles";
import PlaceholderDashboard from "./PlaceholderDashboard";

const CARDS = [
  {
    title: "Matched Roles",
    description:
      "Roles ranked by how well they fit your experience and skills.",
  },
  {
    title: "Applications",
    description:
      "Track every application from applied to interview to offer.",
  },
  {
    title: "Profile Insights",
    description:
      "See how recruiters perceive your profile and what to improve.",
  },
];

const JobSeekerHomePage = () => {
  const { user } = useAuth();

  return (
    <PlaceholderDashboard
      eyebrow="Job Seeker Dashboard"
      title={`Welcome back, ${displayNameFor(user)}!`}
      description="This is a placeholder for your personalized job seeker homepage. Soon you will see role recommendations, application status, and insights from your resume right here."
      gradient="from-indigo-600 via-indigo-500 to-sky-500"
      cards={CARDS}
    />
  );
};

export default JobSeekerHomePage;
