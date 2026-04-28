import { forwardRef } from "react";

const HighlightableItem = forwardRef(function HighlightableItem(
  { highlighted = false, children, className = "", id },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      className={`transition duration-500 ${highlighted ? "border-blue-400 bg-blue-50/80 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" : "border-gray-100"} ${className}`}
    >
      {children}
    </div>
  );
});

export default HighlightableItem;
