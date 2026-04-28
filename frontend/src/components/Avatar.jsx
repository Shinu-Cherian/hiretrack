import { API_BASE } from "../api";

function initialsFrom(name = "User") {
  return name.trim().charAt(0).toUpperCase() || "U";
}

function colorFrom(name = "User") {
  const colors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-violet-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-slate-800",
  ];
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[total % colors.length];
}

export default function Avatar({ src, username = "User", size = "md", className = "", onClick }) {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-28 w-28 text-5xl",
  };

  const resolvedSrc = src ? `${API_BASE}${src}` : "";
  const baseClass = `${sizes[size] || sizes.md} rounded-full border border-white/80 object-cover shadow-sm`;

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        className={`${baseClass} ${onClick ? "cursor-pointer" : ""} ${className}`}
        alt={`${username} profile`}
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className={`${baseClass} ${colorFrom(username)} flex items-center justify-center font-bold text-white ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      aria-label={`${username} profile`}
      role={onClick ? "button" : undefined}
    >
      {initialsFrom(username)}
    </div>
  );
}
