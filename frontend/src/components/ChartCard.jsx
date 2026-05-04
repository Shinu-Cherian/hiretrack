export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`saas-card min-w-0 p-5 hover-3d bg-[#1a1b1b] border-white/5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-extrabold text-white">{title}</h3>
        {subtitle && <p className="text-sm font-bold text-[#FF6044]/80">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
