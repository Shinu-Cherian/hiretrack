export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-200/80 bg-white/90 shadow-sm transition duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
