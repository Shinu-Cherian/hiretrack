import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobForm from "./components/JobForm";
import ReferralForm from "./components/ReferralForm";
import { apiUrl } from "./api";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ExtensionFormPage() {
  const { type } = useParams(); // 'job' or 'referral'
  const [status, setStatus] = useState("idle"); // 'idle', 'saving', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState("");
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleAddJob = async (form) => {
    setStatus("saving");
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
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Could not add job. Are you logged in?");
    }
  };

  const handleAddReferral = async (form) => {
    setStatus("saving");
    const res = await fetch(apiUrl("/api/add-referral/"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Could not add referral. Are you logged in?");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 bg-dot-pattern p-8 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="saas-card p-10 flex flex-col items-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Success!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Entry added to your dashboard.</p>
          <button 
             onClick={() => setStatus("idle")}
             className="mt-8 w-full py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold transition-transform hover:scale-105"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern p-4 md:p-8 flex items-start justify-center overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl border border-white/70 bg-gray-50 p-6 shadow-2xl md:p-8 animate-fade-in-up">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => window.parent.postMessage("close-hiretrack-overlay", "*")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-4"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-950">
              Add New {type === "job" ? "Job" : "Referral"}
            </h1>
          </div>
        </div>

        {status === "error" && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {type === "job" ? (
          <JobForm 
             submitLabel="Add Job" 
             onSubmit={handleAddJob} 
             onCancel={() => window.parent.postMessage("close-hiretrack-overlay", "*")}
          />
        ) : (
          <ReferralForm 
             submitLabel="Save Referral" 
             onSubmit={handleAddReferral}
             onCancel={() => window.parent.postMessage("close-hiretrack-overlay", "*")}
          />
        )}
      </div>
    </div>
  );
}
