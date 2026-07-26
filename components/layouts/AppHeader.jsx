import { Link, NavLink } from "react-router";
import { useAuth } from "../../src/auth/useAuth";
import { ROLES, displayNameFor, homePathForRole } from "../../src/auth/roles";
import Button from "../ui/Button";

/**
 * Navigation for each role. Empty arrays today because the only destination
 * per role is its own dashboard — but every screen from here on (jobs,
 * applications, pipelines) adds one entry to this map rather than editing the
 * header itself.
 */
const NAV_BY_ROLE = {
  [ROLES.JOB_SEEKER]: [{ label: "Dashboard", to: "/dashboard" }],
  [ROLES.RECRUITER]: [{ label: "Dashboard", to: "/recruiter" }],
  [ROLES.ADMIN]: [{ label: "Console", to: "/admin" }],
};

const navLinkClass = ({ isActive }) =>
  `transition hover:text-slate-900 ${
    isActive ? "font-medium text-slate-900" : "text-slate-600"
  }`;

/**
 * Shared chrome for every authenticated screen. Matches the landing page
 * header (white surface, slate hairline, 7xl container) so moving between the
 * public site and the app doesn't feel like changing products.
 */
const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navItems = NAV_BY_ROLE[user?.role] ?? [];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to={homePathForRole(user?.role)}
            className="text-xl font-bold text-slate-900"
          >
            AI Job Portal
          </Link>

          {navItems.length > 0 && (
            <nav className="flex flex-wrap gap-4 text-sm">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-600 sm:inline">
            Signed in as{" "}
            <span className="font-medium text-slate-900">
              {displayNameFor(user)}
            </span>
          </span>
          <Button variant="secondary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
