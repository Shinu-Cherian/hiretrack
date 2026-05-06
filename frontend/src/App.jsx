import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";  
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import JobsPage from "./JobsPage";
import AddJobPage from "./AddJobPage";
import ViewReferrals from "./ViewReferrals";
import AddReferralPage from "./AddReferralPage";
import StarredPage from "./StarredPage";
import NotificationsPage from "./NotificationsPage";
import ProfilePage from "./ProfilePage";
import EditProfilePage from "./EditProfilePage";
import SettingsPage from "./SettingsPage";
import CareerVault from "./CareerVault";
import StreakPage from "./StreakPage";
import ResumeAnalyzerPage from "./ResumeAnalyzerPage";
import CoverLetterPage from "./CoverLetterPage";
import ExtensionFormPage from "./ExtensionFormPage";
import CareerRoadmapPage from "./CareerRoadmapPage";
import AuthGate from "./components/AuthGate";

function Private({ children }) {
  return <AuthGate>{children}</AuthGate>;
}


function App() {
  return (
    <Routes>

      <Route path="/extension/:type" element={<Private><ExtensionFormPage /></Private>} />

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />

      <Route path="/jobs" element={<Private><JobsPage /></Private>} />

      <Route path="/add-job" element={<Private><AddJobPage /></Private>} />

      <Route path="/referrals" element={<Private><ViewReferrals /></Private>} />

      <Route path="/add-referral" element={<Private><AddReferralPage /></Private>} />

      <Route path="/starred" element={<Private><StarredPage /></Private>} />

      <Route path="/notifications" element={<Private><NotificationsPage /></Private>} />

      <Route path="/profile" element={<Private><ProfilePage /></Private>} />

      <Route path="/profile/edit" element={<Private><EditProfilePage /></Private>} />

      <Route path="/settings" element={<Private><SettingsPage /></Private>} />

      <Route path="/career-vault" element={<Private><CareerVault /></Private>} />

      <Route path="/streaks" element={<Private><StreakPage /></Private>} />

      <Route path="/resume-analyzer" element={<Private><ResumeAnalyzerPage /></Private>} />

      <Route path="/cover-letter" element={<Private><CoverLetterPage /></Private>} />

      <Route path="/career-roadmap" element={<Private><CareerRoadmapPage /></Private>} />

    </Routes>
  );
}

export default App;
