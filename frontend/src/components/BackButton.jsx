import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Back", className = "", isMenu = false, to = null }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMenu) {
      window.dispatchEvent(new Event("open-sidebar"));
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-xl bg-[#FF6044] px-4 py-2 text-sm font-black text-[#121313] shadow-lg shadow-[#FF6044]/20 transition-all hover:-translate-y-0.5 hover:shadow-[#FF6044]/40 active:scale-95 ${className}`}
    >
      <ArrowLeft size={18} strokeWidth={3} />
      {isMenu ? "Menu" : label}
    </button>
  );
}
