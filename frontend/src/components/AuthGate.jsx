import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, LockKeyhole, UserPlus } from "lucide-react";
import Header from "../Header";
import { getAuthStatus } from "../api";

export default function AuthGate({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let alive = true;

    getAuthStatus()
      .then((user) => {
        if (alive) setStatus(user.authenticated ? "authenticated" : "guest");
      })
      .catch(() => {
        if (alive) setStatus("guest");
      });

    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (status === "authenticated") {
    return children;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#121313] bg-dot-pattern text-white">
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="saas-card flex flex-col items-center gap-4 p-10 text-center">
            <div className="h-10 w-10 rounded-full border-4 border-white/10 border-t-[#FF6044] animate-spin" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Checking secure session</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern text-white">
      <Header />
      <main className="flex min-h-[76vh] items-center justify-center px-6 py-12">
        <section className="saas-card relative w-full max-w-lg overflow-hidden border-white/10 p-8 text-center shadow-2xl">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6044] to-transparent shadow-[0_0_24px_rgba(255,96,68,0.55)]" />
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6044]/10 text-[#FF6044] ring-1 ring-[#FF6044]/20">
            <LockKeyhole size={30} />
          </div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#FF6044]">Login required</p>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white">Use HireTrack with your own workspace</h1>
          <p className="mx-auto mb-7 max-w-sm text-sm leading-6 text-gray-400">
            Jobs, referrals, dashboards, profile data, and notifications are private to each account. Sign in or create an account to continue.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6044] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#121313] transition hover:bg-[#ff4d2e]"
            >
              <Briefcase size={18} /> Sign in
            </Link>
            <Link
              to="/signup"
              state={{ from: location.pathname }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              <UserPlus size={18} /> Sign up
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
