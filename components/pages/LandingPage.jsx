import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../src/auth/useAuth";
import FinalCTA from "../FinalCTA";
import Header from "../Header";
import HeroSection from "../HeroSection";
import JobSeekerSection from "../JobSeekerSection";
import LoginModal from "../LoginModal";
import RecruiterSection from "../RecruiterSection";
import SignupModal from "../SignupModal";
import TrustSection from "../TrustSection";

/**
 * Public landing page. `/`, `/login`, and `/signup` all render this component;
 * the path decides which modal is open.
 *
 * Driving the modals from the URL keeps the existing overlay UX exactly as it
 * was while making both flows linkable and back-button friendly — which is
 * what lets ProtectedRoute bounce someone to `/login` and have them land on a
 * real sign-in surface rather than a bare landing page.
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  const activeModal =
    location.pathname === "/signup"
      ? "signup"
      : location.pathname === "/login"
        ? "login"
        : null;

  // Carry `state` across modal switches so the "where were they headed?"
  // breadcrumb survives a detour through signup.
  const openLogin = () => navigate("/login", { state: location.state });
  const openSignup = () => navigate("/signup", { state: location.state });
  const closeModal = () => navigate("/", { state: location.state });

  // Seeding the session is all that's needed — GuestRoute owns the redirect,
  // so there is exactly one place deciding where a signed-in user goes.
  const handleLoginSuccess = (user) => setSession(user);

  return (
    <>
      <Header onUploadResumeClick={openLogin} onPostJobClick={openSignup} />

      <main>
        <HeroSection onUploadResumeClick={openLogin} />
        <JobSeekerSection />
        <RecruiterSection />
        <TrustSection />
        <FinalCTA onUploadResumeClick={openLogin} />
      </main>

      <LoginModal
        isOpen={activeModal === "login"}
        onClose={closeModal}
        onRegisterClick={openSignup}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignupModal
        isOpen={activeModal === "signup"}
        onClose={closeModal}
        onSignInClick={openLogin}
        onSignupSuccess={openLogin}
      />
    </>
  );
};

export default LandingPage;
