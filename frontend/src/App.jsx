import { BrowserRouter, Routes, Route } from "react-router-dom";
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


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/jobs" element={<JobsPage />} />

        <Route path="/add-job" element={<AddJobPage />} />

        <Route path="/referrals" element={<ViewReferrals />} />

        <Route path="/add-referral" element={<AddReferralPage />} />

        <Route path="/starred" element={<StarredPage />} />

        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/profile/edit" element={<EditProfilePage />} />

        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/career-vault" element={<CareerVault />} />

        <Route path="/streaks" element={<StreakPage />} />

        <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />

        <Route path="/cover-letter" element={<CoverLetterPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
