import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from "lucide-react";

function YearList({ selectedYear, onSelect, years }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const active = scrollRef.current?.querySelector('[data-active="true"]');
      if (active) {
        active.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={scrollRef} className="absolute top-8 left-0 w-full bg-[#121313] border border-white/10 rounded-lg p-2 max-h-[180px] overflow-y-auto custom-scrollbar z-[110] shadow-2xl animate-fade-in grid grid-cols-3 gap-1">
      {years.map(y => (
        <button
          key={y}
          type="button"
          data-active={y === selectedYear}
          onClick={() => onSelect(y)}
          className={`p-1.5 text-[11px] font-black rounded-md transition-colors ${y === selectedYear ? "bg-[#FF6044] text-[#121313]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}

export default function CustomDatePicker({ value, onChange, placeholder = "Select date..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("days"); // 'days' | 'months' | 'years'
  const containerRef = useRef(null);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setView("days"); // FORCE days view on open
      const now = new Date();
      if (value) {
        const valDate = new Date(value);
        setCurrentDate(!isNaN(valDate.getTime()) ? valDate : now);
      } else {
        setCurrentDate(now);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView("days");
  };

  const handleMonthChange = (monthIdx) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIdx, 1));
    setView("days");
  };

  const handleDateSelect = (day) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === value;

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={`h-8 w-8 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center
            ${isSelected ? "bg-[#FF6044] text-[#121313] scale-105 z-10"
              : isToday ? "border border-[#FF6044]/50 text-[#FF6044] hover:bg-[#FF6044]/10"
                : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div onClick={toggleOpen} className="form-input flex items-center justify-between cursor-pointer group">
        <span className={value ? "text-white font-medium" : "text-gray-500"}>
          {value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : placeholder}
        </span>
        <CalendarIcon size={16} className="text-gray-500 group-hover:text-[#FF6044] transition-colors" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[280px] bg-[#0a0b0b] border border-white/10 rounded-xl p-4 shadow-2xl z-[100] select-none">
          {/* Custom Header */}
          <div className="flex items-center justify-between mb-4 gap-2 relative">
            <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
              <button
                type="button"
                onClick={() => setView(view === "months" ? "days" : "months")}
                className="flex items-center gap-1 text-sm font-black text-white hover:text-[#FF6044] transition-colors"
              >
                {monthNames[currentDate.getMonth()]} <ChevronDown size={12} className="opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => setView(view === "years" ? "days" : "years")}
                className="flex items-center gap-1 text-sm font-black text-white hover:text-[#FF6044] transition-colors"
              >
                {currentDate.getFullYear()} <ChevronDown size={12} className="opacity-50" />
              </button>
            </div>

            <div className="flex gap-1">
              <button onClick={handlePrevMonth} type="button" className="p-1 hover:bg-white/5 rounded text-gray-400 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNextMonth} type="button" className="p-1 hover:bg-white/5 rounded text-gray-400 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Overlays using the new 'view' state */}
            {view === "months" && (
              <div className="absolute top-8 left-0 w-full bg-[#121313] border border-white/10 rounded-lg p-2 grid grid-cols-3 gap-1 z-[110] shadow-2xl animate-fade-in">
                {monthNames.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMonthChange(i)}
                    className={`p-1.5 text-[11px] font-black rounded-md transition-colors ${currentDate.getMonth() === i ? "bg-[#FF6044] text-[#121313]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {view === "years" && (
              <YearList selectedYear={currentDate.getFullYear()} onSelect={handleYearChange} years={years} />
            )}
          </div>

          {view === "days" && (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="h-8 w-8 flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-[#FF6044] opacity-40">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
            </>
          )}

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
            <button type="button" onClick={() => { onChange(""); setIsOpen(false); }} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider">Clear</button>
            <button type="button" onClick={() => {
              const now = new Date();
              const y = now.getFullYear();
              const m = String(now.getMonth() + 1).padStart(2, '0');
              const d = String(now.getDate()).padStart(2, '0');
              onChange(`${y}-${m}-${d}`);
              setIsOpen(false);
            }} className="text-[10px] font-bold text-[#FF6044] hover:underline uppercase tracking-wider">Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
