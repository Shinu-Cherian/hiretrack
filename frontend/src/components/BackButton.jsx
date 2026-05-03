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
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-950 ${className}`}
    >
      <ArrowLeft size={16} />
      {isMenu ? "Menu" : label}
    </button>
  );
}
