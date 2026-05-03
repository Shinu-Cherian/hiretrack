import { forwardRef } from "react";

const HighlightableItem = forwardRef(function HighlightableItem(
  { highlighted = false, children, className = "", id },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 ${
        highlighted 
          ? "border-blue-400 bg-blue-50/80 dark:bg-blue-900/30 dark:border-blue-500/50 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" 
          : "border-gray-100 dark:border-gray-800"
      } ${className}`}
    >
      {children}
    </div>
  );
});

export default HighlightableItem;
