const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Heatmap({ title, data = [], noun = "submissions" }) {
  const counts = new Map(data.map((item) => [item.date, item.count]));
  const days = buildDays(365);
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const activeDays = data.filter((item) => item.count > 0).length;
  const maxStreak = calculateMaxStreak(new Set(data.filter((item) => item.count > 0).map((item) => item.date)));
  
  // Group days by month
  const months = [];
  let currentMonthStr = "";
  let currentMonthDays = [];

  days.forEach((day) => {
    const monthStr = day.slice(0, 7); // "YYYY-MM"
    if (monthStr !== currentMonthStr) {
      if (currentMonthDays.length > 0) {
        months.push({ monthStr: currentMonthStr, days: currentMonthDays });
      }
      currentMonthStr = monthStr;
      currentMonthDays = [];
    }
    currentMonthDays.push(day);
  });
  if (currentMonthDays.length > 0) {
    months.push({ monthStr: currentMonthStr, days: currentMonthDays });
  }

  return (
    <section className="p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-2xl font-black text-[#FF6044]">{total}</span> {noun} in the past one year
          </p>
        </div>
        <div className="flex gap-6 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <span>Total active days: <strong className="text-white">{activeDays}</strong></span>
          <span>Max streak: <strong className="text-white">{maxStreak}</strong></span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-3 min-w-max">
          {months.map((month) => {
            // Calculate day of the week for the first day of this month block
            const firstDayOfWeek = new Date(`${month.days[0]}T00:00:00`).getDay();
            const paddedDays = Array(firstDayOfWeek).fill(null).concat(month.days);
            const monthName = MONTHS[new Date(`${month.days[0]}T00:00:00`).getMonth()];
            
            return (
              <div key={month.monthStr} className="flex flex-col gap-3">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {paddedDays.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} className="h-3.5 w-3.5" />;
                    const count = counts.get(day) || 0;
                    return (
                      <div
                        key={day}
                        title={`${day}: ${count} ${noun}`}
                        className={`h-3.5 w-3.5 rounded-[3px] transition-colors hover:ring-2 hover:ring-gray-300 ${colorFor(count)}`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-medium text-gray-400 pl-1">{monthName}</span>
              </div>
            );
          })}
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
  if (count >= 5) return "bg-[#FF6044]";
  if (count >= 3) return "bg-[#FF6044]/70";
  if (count >= 1) return "bg-[#FF6044]/40";
  return "bg-white/5 border border-white/5";
}
