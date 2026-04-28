export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-gray-200/80 bg-white/90 p-5 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
