import { useState } from "react";
import JobSeekerHomePage from "../components/JobSeekerHomePage";
import LandingPage from "../components/LandingPage";

function App() {
  // Simple in-memory auth state. The real auth lives in HttpOnly cookies on
  // the backend; this state just controls which view the SPA renders.
  const [authedUser, setAuthedUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setAuthedUser(user);
  };

  const handleSignOut = () => {
    setAuthedUser(null);
  };

  if (authedUser) {
    return <JobSeekerHomePage user={authedUser} onSignOut={handleSignOut} />;
  }

  return <LandingPage onLoginSuccess={handleLoginSuccess} />;
}

export default App;
