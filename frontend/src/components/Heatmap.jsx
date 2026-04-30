const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Heatmap({ title, data = [], noun = "submissions" }) {
  const counts = new Map(data.map((item) => [item.date, item.count]));
  const days = buildDays(365);
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const activeDays = data.filter((item) => item.count > 0).length;
  const maxStreak = calculateMaxStreak(new Set(data.filter((item) => item.count > 0).map((item) => item.date)));
  const monthLabels = buildMonthLabels(days);

  return (
    <section className="rounded-xl bg-[#252525] p-5 text-gray-100 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-300">
            <span className="text-2xl font-bold text-white">{total}</span> {noun} in the past one year
          </p>
        </div>
        <div className="flex gap-6 text-sm text-gray-300">
          <span>Total active days: <strong className="text-white">{activeDays}</strong></span>
          <span>Max streak: <strong className="text-white">{maxStreak}</strong></span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="min-w-[1050px]">
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {days.map((day) => {
              const count = counts.get(day) || 0;
              return (
                <div
                  key={day}
                  title={`${day}: ${count} ${noun}`}
                  className={`h-3.5 w-3.5 rounded-[3px] ${colorFor(count)}`}
                />
              );
            })}
          </div>
          <div className="relative mt-3 h-6 text-sm text-gray-300">
            {monthLabels.map((label) => (
              <span key={`${label.month}-${label.left}`} className="absolute" style={{ left: `${label.left}%` }}>
                {label.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function buildDays(total) {
  const days = [];
  const current = new Date();
  current.setDate(current.getDate() - (total - 1));
  for (let i = 0; i < total; i += 1) {
    days.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function buildMonthLabels(days) {
  const labels = [];
  let lastMonth = "";
  days.forEach((day, index) => {
    const month = MONTHS[new Date(`${day}T00:00:00`).getMonth()];
    if (month !== lastMonth) {
      labels.push({ month, left: (index / days.length) * 100 });
      lastMonth = month;
    }
  });
  return labels;
}

function calculateMaxStreak(activeDays) {
  let max = 0;
  let current = 0;
  buildDays(365).forEach((day) => {
    if (activeDays.has(day)) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  });
  return max;
}

function colorFor(count) {
  if (count >= 5) return "bg-green-400";
  if (count >= 3) return "bg-green-500";
  if (count >= 1) return "bg-green-700";
  return "bg-[#3a3a3a]";
}
