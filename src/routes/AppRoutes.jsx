import { Route, Routes } from "react-router";
import AppLayout from "../../components/layouts/AppLayout";
import AdminHomePage from "../../components/pages/AdminHomePage";
import JobSeekerHomePage from "../../components/pages/JobSeekerHomePage";
import LandingPage from "../../components/pages/LandingPage";
import NotFoundPage from "../../components/pages/NotFoundPage";
import ProfilePage from "../../components/pages/ProfilePage";
import RecruiterHomePage from "../../components/pages/RecruiterHomePage";
import GuestRoute from "../../components/routes/GuestRoute";
import ProtectedRoute from "../../components/routes/ProtectedRoute";
import { ROLES } from "../auth/roles";

/**
 * Route table for the whole app.
 *
 * Two guards wrap everything: GuestRoute for public surfaces (and the redirect
 * away from them once signed in), ProtectedRoute for the rest. Authenticated
 * routes nest inside AppLayout so they share one header and page container.
 *
 * Adding a screen means adding one <Route> under the right role — the guard,
 * chrome, and redirect behaviour come for free.
 */
const AppRoutes = () => (
  <Routes>
    <Route element={<GuestRoute />}>
      {/* All three render LandingPage; the path selects the modal. */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/signup" element={<LandingPage />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.JOB_SEEKER]} />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<JobSeekerHomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.RECRUITER]} />}>
      <Route element={<AppLayout />}>
        <Route path="/recruiter" element={<RecruiterHomePage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
      <Route element={<AppLayout />}>
        <Route path="/admin" element={<AdminHomePage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
