import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { apiUrl } from "./api";

function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken"))
    ?.split("=")[1];
}

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    await fetch(apiUrl("/get-csrf/"), {
      credentials: "include",
    });

    const res = await fetch(apiUrl("/signup/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
      body: new URLSearchParams({
        username: username,
        password: password,
        confirm_password: confirm,
      }),
    });
    setSubmitting(false);

    if (res.ok) {
      localStorage.setItem("isLoggedIn", "true"); 
      alert("Account created! Please login.");
      navigate("/login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-pattern bg-gray-50 p-4">
      <div className="w-full max-w-4xl animate-fade-in-up">
        
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-8">
          <Briefcase className="h-7 w-7 text-gray-900" />
          <span className="text-gray-900">Hire<span className="text-gray-500">Track</span></span>
        </Link>

        <div className="saas-card overflow-hidden flex flex-col md:flex-row-reverse">
          
          {/* Illustration Side */}
          <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent z-0" />
            <img 
              src="/login_illustration.png" 
              alt="Join Workspace" 
              className="relative z-10 w-full max-w-sm object-contain drop-shadow-2xl animate-fade-in-up delay-100"
            />
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500 mb-8 font-light">Start organizing your job search pipeline today.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="form-input"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="form-input"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className="form-input"
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium shadow-md hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-70 mt-4"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-8 font-light">
              Already have an account?{" "}
              <Link to="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
