import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

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
    // 👇 MUST ADD THIS
await fetch("http://127.0.0.1:8000/get-csrf/", {
  credentials: "include",
});

// 👇 YOUR EXISTING CODE
const res = await fetch("http://127.0.0.1:8000/signup/", {
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
        navigate("/login");   // 🔥 redirect ivide
        } else {
  alert("Signup failed");
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

          <h2 className="text-xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-500 mb-4">Start tracking jobs</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button className="w-full bg-black text-white py-2 rounded">
              {submitting ? "Creating..." : "Create account"}
            </button>

          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}