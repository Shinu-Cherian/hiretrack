import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import JobForm from "./components/JobForm";

export default function AddJobPage() {
  const navigate = useNavigate();

  const closePage = () => navigate(-1);

  const handleSave = async (form) => {
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) body.append(key, value);
    });

    const res = await fetch(apiUrl("/api/add-job/"), {
      method: "POST",
      credentials: "include",
      body,
    });

    if (res.ok) {
      navigate("/jobs");
      return;
    }

    if (res.status === 401) {
      alert("Please login again before adding a job");
      navigate("/login");
      return;
    }

    alert("Error adding job");
  };

  return (
    <div className="min-h-screen bg-[#121313] text-white">
      <div className="pointer-events-none blur-sm opacity-30">
        <Home />
      </div>

      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-5 md:p-8" onClick={closePage}>
        <section
          onClick={(event) => event.stopPropagation()}
          className="saas-card w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1a1b1b]/95 p-6 shadow-2xl md:p-8"
        >
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Add New Job</h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Job Application Details</p>
            </div>
            <button type="button" onClick={closePage} className="rounded-xl p-2.5 text-[#FF6044] bg-[#FF6044]/5 border border-[#FF6044]/10 hover:bg-[#FF6044] hover:text-[#121313] transition-all" aria-label="Close">
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          <JobForm submitLabel="Add Job" onSubmit={handleSave} onCancel={closePage} />
        </section>
      </div>
    </div>
  );
}
