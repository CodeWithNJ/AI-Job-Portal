import { useAuth } from "../../src/auth/useAuth";
import { displayNameFor } from "../../src/auth/roles";
import PlaceholderDashboard from "./PlaceholderDashboard";

const CARDS = [
  {
    title: "Moderation",
    description: "Review reported job posts and profiles before they surface.",
  },
  {
    title: "Taxonomy",
    description:
      "Curate the skill vocabulary that retrieval relevance depends on.",
  },
  {
    title: "AI Audit Log",
    description:
      "Inspect why a recommendation was made when a match is disputed.",
  },
];

/**
 * Admins can authenticate today but have no profile shape on the API
 * (`GET /profiles/me` rejects the role), so this deliberately shows only
 * platform-level concerns and never touches the profile endpoints.
 */
const AdminHomePage = () => {
  const { user } = useAuth();

  return (
    <PlaceholderDashboard
      eyebrow="Platform Admin"
      title={`Welcome back, ${displayNameFor(user)}!`}
      description="This is a placeholder for the admin console. Moderation, taxonomy management, and auditability of AI outputs will live here."
      gradient="from-slate-800 via-slate-700 to-indigo-700"
      cards={CARDS}
    />
  );
};

export default AdminHomePage;
