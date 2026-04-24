import { Star, Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {


const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn"); // remove login flag
  onClose(); // close sidebar
  navigate("/"); // go home
  window.location.reload(); // refresh UI
};

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5">

          {/* PROFILE */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/default-avatar.png"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">Shine</h3>
              <p className="text-sm text-gray-500 cursor-pointer hover:underline">
                View Profile
              </p>
            </div>
          </div>

          <hr className="mb-4" />

          {/* MENU */}
          <div className="space-y-2">

            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <Star size={18} /> Starred
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <Bell size={18} /> Notifications
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <Settings size={18} /> Settings
            </div>

          </div>

          <hr className="my-4" />

          {/* LOGOUT */}
          <button
           onClick={handleLogout} 
          className="flex items-center gap-3 p-2 w-full rounded-lg hover:bg-red-100 text-red-600 transition"
          >
            
            <LogOut size={18} /> Logout
          </button>

        </div>
      </div>
    </>
  );
}