import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function Header() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <header className="sticky top-0 glass">
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
                className="w-8 h-8 rounded-full border"
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
  );
}