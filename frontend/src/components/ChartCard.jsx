export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`saas-card min-w-0 p-5 hover-3d ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-950">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
