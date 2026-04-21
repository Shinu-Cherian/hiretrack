import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";  
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import JobsPage from "./JobsPage";
import AddJobPage from "./AddJobPage";
import ViewReferrals from "./ViewReferrals";
import AddReferralPage from "./AddReferralPage";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;