import Header from "./Header";
import HeroSection from "./HeroSection";
import JobSeekerSection from "./JobSeekerSection";
import RecruiterSection from "./RecruiterSection";

const LandingPage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <JobSeekerSection />
        <RecruiterSection />
      </main>
    </>
  );
};

export default LandingPage;
