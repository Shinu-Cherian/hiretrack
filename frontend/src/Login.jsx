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
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-6">
          <Briefcase className="h-7 w-7 text-primary" />
          <span>Hire<span className="text-primary">Track</span></span>
        </Link>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-4">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="w-full bg-black text-white py-2 rounded">
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
