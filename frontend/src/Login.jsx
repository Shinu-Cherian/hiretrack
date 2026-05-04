import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { apiUrl } from "./api";

function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch(apiUrl("/login/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
      body: new URLSearchParams({
        username,
        password,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.username || username);
      if (data.profile_pic) {
        localStorage.setItem("profile_pic", data.profile_pic);
      } else {
        localStorage.removeItem("profile_pic");
      }
      navigate("/");
      window.location.reload();
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-pattern bg-[#121313] p-4 text-white">
      <div className="w-full max-w-4xl animate-fade-in-up">
        <Link to="/" className="flex items-center justify-center gap-2 font-extrabold text-2xl mb-8">
          <Briefcase className="h-7 w-7 text-[#FF6044]" />
          <span className="text-white">Hire<span className="text-gray-400 font-light">Track</span></span>
        </Link>

        <div className="saas-card overflow-hidden flex flex-col md:flex-row">
          
          {/* Illustration Side */}
          <div className="hidden md:flex md:w-1/2 bg-[#1a1b1b] items-center justify-center p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6044]/5 to-transparent z-0" />
            <img 
              src="/login_illustration.png" 
              alt="Security and Access" 
              className="relative z-10 w-full max-w-sm object-contain drop-shadow-[0_0_30px_rgba(255,96,68,0.2)] animate-fade-in-up delay-100"
            />
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center bg-transparent">
            <h2 className="text-2xl font-extrabold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 mb-8 font-light">Sign in to your workspace to continue.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#FF6044] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#FF6044]/20 hover:bg-[#ff4d2e] hover:shadow-[#FF6044]/40 hover:-translate-y-1 transition-all disabled:opacity-70 mt-4"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="text-sm text-gray-400 text-center mt-8 font-light">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#FF6044] font-bold hover:underline">Sign up for free</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
