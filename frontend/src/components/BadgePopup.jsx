export default function BadgePopup({ badge, onClose }) {
  if (!badge) return null;
  return (
    <div className="fixed inset-x-0 top-6 z-[70] flex justify-center px-4">
      <div className="rounded-xl bg-gray-950 px-5 py-4 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <p className="font-semibold">You unlocked {badge}-day streak badge!</p>
          <button onClick={onClose} className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20">Close</button>
        </div>
      </div>
    </div>
  );
}
