import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ManifestoPage from "./ManifestoPage";
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
import RoadmapPage from "./RoadmapPage";
import SecurityPage from "./SecurityPage";
import LegalPage from "./LegalPage";
import BlogPage from "./BlogPage";
import AuthGate from "./components/AuthGate";

function Private({ children }) {
  return <AuthGate>{children}</AuthGate>;
}


function App() {
  return (
    <Routes>
      <Route path="/extension/:type" element={<Private><ExtensionFormPage /></Private>} />
      <Route path="/" element={<Home />} />
      <Route path="/manifesto" element={<ManifestoPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/add-job" element={<AddJobPage />} />
      <Route path="/referrals" element={<ViewReferrals />} />
      <Route path="/add-referral" element={<AddReferralPage />} />
      <Route path="/starred" element={<Private><StarredPage /></Private>} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<Private><ProfilePage /></Private>} />
      <Route path="/profile/edit" element={<Private><EditProfilePage /></Private>} />
      <Route path="/settings" element={<Private><SettingsPage /></Private>} />
      <Route path="/career-vault" element={<Private><CareerVault /></Private>} />
      <Route path="/streaks" element={<StreakPage />} />
      <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
      <Route path="/cover-letter" element={<CoverLetterPage />} />
      <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/privacy" element={<LegalPage />} />
      <Route path="/terms" element={<LegalPage />} />
      <Route path="/blog" element={<BlogPage />} />
    </Routes>
  );
}

export default App;
