import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { API_BASE, apiUrl } from "./api";

export default function Header() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(apiUrl("/api/profile/"), {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          localStorage.setItem("username", data.username || "User");
          if (data.profile_pic) {
            localStorage.setItem("profile_pic", data.profile_pic);
          } else {
            localStorage.removeItem("profile_pic");
          }
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic");

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass">
        <div className="flex justify-between items-center p-4">

          {/* LEFT */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Briefcase /> HireTrack
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <img
                  src={profilePic ? `${API_BASE}${profilePic}` : "/default-avatar.png"}
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  alt="Profile"
                  onClick={() => setSidebarOpen(true)}
                />
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm">Login</button>
                </Link>

                <Link to="/signup">
                  <button className="px-4 py-2 bg-black text-white rounded">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* 🔥 SIDEBAR MUST BE HERE */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
    </>
  );
}
