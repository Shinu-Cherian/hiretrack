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

  const bgApiRequest = (endpoint, payload) => {
    return new Promise((resolve, reject) => {
      const msgId = Date.now().toString() + Math.random().toString();
      
      const listener = (event) => {
        if (event.data && event.data.type === "HT_API_RESPONSE" && event.data.id === msgId) {
          window.removeEventListener("message", listener);
          if (event.data.response.success) resolve(event.data.response.data);
          else reject(new Error(event.data.response.error));
        }
      };
      
      window.addEventListener("message", listener);
      window.parent.postMessage({
        type: "HT_API_POST",
        id: msgId,
        endpoint,
        payload
      }, "*");
      
      setTimeout(() => {
        window.removeEventListener("message", listener);
        reject(new Error("Request timed out"));
      }, 10000);
    });
  };

  const handleAddJob = async (form) => {
    setStatus("saving");
    try {
      await bgApiRequest("/api/add-job/", form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message === "NOT_LOGGED_IN" ? "Please log in to your HireTrack website first." : "Could not add job. Try again.");
    }
  };

  const handleAddReferral = async (form) => {
    setStatus("saving");
    try {
      await bgApiRequest("/api/add-referral/", form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message === "NOT_LOGGED_IN" ? "Please log in to your HireTrack website first." : "Could not add referral. Try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#101212] bg-dot-pattern p-8 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="bg-[#1A1B1B] border border-white/10 rounded-2xl p-10 flex flex-col items-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-[#FF6044]/10 text-[#FF6044] border border-[#FF6044]/20 flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black font-display uppercase tracking-widest text-white">Success!</h2>
          <p className="text-gray-400 font-light mt-2">Entry added to your dashboard.</p>
          <button 
             onClick={() => setStatus("idle")}
             className="mt-8 w-full py-4 bg-white text-[#121313] hover:bg-[#FF6044] hover:text-white rounded-xl font-black uppercase tracking-widest text-sm transition-colors"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101212] bg-dot-pattern p-4 md:p-8 flex items-start justify-center overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1A1B1B] p-6 shadow-2xl md:p-8 animate-fade-in-up">
        <div className="mb-8 flex flex-col items-start gap-4 border-b border-white/5 pb-6">
          <button 
            onClick={() => window.parent.postMessage("close-hiretrack-overlay", "*")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium mb-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-3xl font-black font-display text-white uppercase tracking-widest">
            Add New {type === "job" ? "Job" : "Referral"}
          </h1>
        </div>

        {status === "error" && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
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
