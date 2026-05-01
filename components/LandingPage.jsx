import Header from "./Header";
import HeroSection from "./HeroSection";
import JobSeekerSection from "./JobSeekerSection";

const LandingPage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <JobSeekerSection />
      </main>
    </>
  );
};

export default LandingPage;
