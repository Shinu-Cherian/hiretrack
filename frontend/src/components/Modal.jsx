import { X } from "lucide-react";

export default function Modal({ title, children, onClose, maxWidth = "max-w-3xl" }) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4"
      onMouseDown={onClose}
    >
      <section
        className={`modal-box max-h-[88vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-[#121313] p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 md:p-8 animate-fade-in-up`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>
        <div className="text-white">
          {children}
        </div>
      </section>
    </div>
  );
}
