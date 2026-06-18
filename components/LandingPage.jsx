import { useState } from "react";
import FinalCTA from "./FinalCTA";
import Header from "./Header";
import HeroSection from "./HeroSection";
import JobSeekerSection from "./JobSeekerSection";
import LoginModal from "./LoginModal";
import RecruiterSection from "./RecruiterSection";
import SignupModal from "./SignupModal";
import TrustSection from "./TrustSection";

const LandingPage = ({ onLoginSuccess }) => {
  const [activeModal, setActiveModal] = useState(null);

  const openLogin = () => setActiveModal("login");
  const openSignup = () => setActiveModal("signup");
  const closeModal = () => setActiveModal(null);

  const handleLoginSuccess = (user) => {
    setActiveModal(null);
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  return (
    <>
      <Header onUploadResumeClick={openLogin} />

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
