import { forwardRef } from "react";

const HighlightableItem = forwardRef(function HighlightableItem(
  { highlighted = false, children, className = "", id },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-500 hover:bg-white/5 ${
        highlighted 
          ? "border-[#FF6044]/50 bg-[#FF6044]/10 shadow-[0_0_20px_rgba(255,96,68,0.1)]" 
          : "border-white/5"
      } ${className}`}
    >
      {children}
    </div>
  );
});

export default HighlightableItem;
