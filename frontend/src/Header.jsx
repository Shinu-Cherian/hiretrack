import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Header() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                  src="/default-avatar.png"
                  className="w-8 h-8 rounded-full border cursor-pointer"
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
      />
    </>
  );
}