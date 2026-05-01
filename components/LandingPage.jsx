import FinalCTA from "./FinalCTA";
import Header from "./Header";
import HeroSection from "./HeroSection";
import JobSeekerSection from "./JobSeekerSection";
import RecruiterSection from "./RecruiterSection";
import TrustSection from "./TrustSection";

const LandingPage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <JobSeekerSection />
        <RecruiterSection />
        <TrustSection />
        <FinalCTA />
      </main>
    </>
  );
};

export default LandingPage;
