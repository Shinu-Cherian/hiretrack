import { Link, useLocation } from "react-router-dom";
import { Briefcase, LockKeyhole, UserPlus, X } from "lucide-react";

export default function AuthActionModal({ isOpen, onClose, title = "Login Required", message = "Sign in or create an account to continue." }) {
  const location = useLocation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <section 
        className="saas-card relative w-full max-w-lg overflow-hidden border-white/10 p-10 text-center shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Glow */}
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6044] to-transparent shadow-[0_0_24px_rgba(255,96,68,0.55)]" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-gray-500 hover:bg-white/5 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6044]/10 text-[#FF6044] ring-1 ring-[#FF6044]/20">
          <LockKeyhole size={30} />
        </div>
        
        {/* Label */}
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#FF6044]">
          {title === "Login Required" ? "Secure Access" : title}
        </p>

        {/* Title */}
        <h2 className="mb-3 text-3xl font-black tracking-tight text-white leading-tight">
          Use HireTrack with your own workspace
        </h2>

        {/* Message */}
        <p className="mx-auto mb-7 max-w-sm text-sm leading-6 text-gray-400">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6044] px-8 py-3.5 text-sm font-black uppercase tracking-widest text-[#121313] transition-all hover:bg-[#ff4d2e] hover:shadow-[0_0_20px_rgba(255,96,68,0.3)] active:scale-95"
          >
            <Briefcase size={18} /> Sign in
          </Link>
          <Link
            to="/signup"
            state={{ from: location.pathname }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <UserPlus size={18} /> Sign up
          </Link>
        </div>
      </section>

      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
