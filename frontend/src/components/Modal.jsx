import { X } from "lucide-react";

export default function Modal({ title, children, onClose, maxWidth = "max-w-3xl" }) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-4"
      onMouseDown={onClose}
    >
      <section
        className={`modal-box max-h-[88vh] w-full ${maxWidth} overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
