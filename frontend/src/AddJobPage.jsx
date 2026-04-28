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
    const res = await fetch(apiUrl("/api/add-job/"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    <div className="min-h-screen bg-gray-100">
      <div className="pointer-events-none blur-sm brightness-75">
        <Home />
      </div>

      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-5 md:p-8" onClick={closePage}>
        <section
          onClick={(event) => event.stopPropagation()}
          className="modal-box w-full max-w-3xl rounded-xl border border-white/70 bg-gray-50 p-6 shadow-2xl md:p-8"
        >
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <BackButton />
              <h1 className="mt-4 text-2xl font-bold text-gray-950">Add New Job</h1>
            </div>
            <button type="button" onClick={closePage} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label="Close">
              <X size={22} />
            </button>
          </div>

          <JobForm submitLabel="Add Job" onSubmit={handleSave} onCancel={closePage} />
        </section>
      </div>
    </div>
  );
}
