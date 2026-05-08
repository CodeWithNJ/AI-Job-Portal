import { useState } from "react";
import FinalCTA from "./FinalCTA";
import Header from "./Header";
import HeroSection from "./HeroSection";
import JobSeekerSection from "./JobSeekerSection";
import LoginModal from "./LoginModal";
import RecruiterSection from "./RecruiterSection";
import SignupModal from "./SignupModal";
import TrustSection from "./TrustSection";

const LandingPage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openLogin = () => setActiveModal("login");
  const openSignup = () => setActiveModal("signup");
  const closeModal = () => setActiveModal(null);

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
      />

      <SignupModal
        isOpen={activeModal === "signup"}
        onClose={closeModal}
        onSignInClick={openLogin}
      />
    </>
  );
};

export default LandingPage;
