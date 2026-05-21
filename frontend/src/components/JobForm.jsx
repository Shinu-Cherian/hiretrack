import { useState } from "react";
import { Field, SelectInput, TextArea, TextInput } from "./FormFields";

const emptyJob = {
  jobTitle: "",
  company: "",
  jobId: "",
  platform: "",
  dateApplied: "",
  status: "applied",
  location: "",
  salaryRange: "",
  jd: "",
  notes: "",
  resume_file: null,
  cover_letter_file: null,
};

export default function JobForm({ initialValues = emptyJob, submitLabel = "Save Job", onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyJob, ...initialValues });
  const [fileErrors, setFileErrors] = useState({ resume: "", coverLetter: "" });
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > 3 * 1024 * 1024) {
      setFileErrors((prev) => ({ ...prev, resume: "file is too large! maximum size allowed is 3MB. ⚠️" }));
      event.target.value = ""; // Clear file input
      update("resume_file", null);
    } else {
      setFileErrors((prev) => ({ ...prev, resume: "" }));
      update("resume_file", file);
    }
  };

  const handleCoverLetterChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > 3 * 1024 * 1024) {
      setFileErrors((prev) => ({ ...prev, coverLetter: "file is too large! maximum size allowed is 3MB. ⚠️" }));
      event.target.value = ""; // Clear file input
      update("cover_letter_file", null);
    } else {
      setFileErrors((prev) => ({ ...prev, coverLetter: "" }));
      update("cover_letter_file", file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fileErrors.resume || fileErrors.coverLetter) {
      alert("Please fix file errors before saving.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Column: Job Essentials */}
        <div className="flex-1 space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Job Title *">
              <TextInput required autoFocus placeholder="Software Engineer" value={form.jobTitle} onChange={(value) => update("jobTitle", value)} />
            </Field>

            <Field label="Company *">
              <TextInput required placeholder="Google" value={form.company} onChange={(value) => update("company", value)} />
            </Field>

            <Field label="Job ID">
              <TextInput placeholder="JOB-12345" value={form.jobId} onChange={(value) => update("jobId", value)} />
            </Field>

            <Field label="Platform">
              <TextInput placeholder="LinkedIn, Indeed..." value={form.platform} onChange={(value) => update("platform", value)} />
            </Field>

            <Field label="Date Applied *">
              <TextInput required type="date" placeholder="10 May 2026" value={form.dateApplied} onChange={(value) => update("dateApplied", value)} />
            </Field>

            <Field label="Status">
              <SelectInput value={form.status} onChange={(value) => update("status", value)}>
                <option value="applied">Applied</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="selected">Selected</option>
              </SelectInput>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Location">
              <TextInput placeholder="Bangalore, Remote, Dubai..." value={form.location} onChange={(value) => update("location", value)} />
            </Field>

            <Field label="Salary Range">
              <TextInput placeholder="$100k - $150k" value={form.salaryRange} onChange={(value) => update("salaryRange", value)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Resume Used">
              <input
                type="file"
                className={`form-input ${fileErrors.resume ? 'border-[#FF6044]/50 text-[#FF6044]' : ''}`}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleResumeChange}
              />
              {fileErrors.resume ? (
                <p className="text-[#FF6044] text-[10px] font-bold uppercase tracking-wider mt-1">{fileErrors.resume}</p>
              ) : (
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">supports pdf, docx, txt (max 3mb)</p>
              )}
            </Field>

            <Field label="Cover Letter Used">
              <input
                type="file"
                className={`form-input ${fileErrors.coverLetter ? 'border-[#FF6044]/50 text-[#FF6044]' : ''}`}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleCoverLetterChange}
              />
              {fileErrors.coverLetter ? (
                <p className="text-[#FF6044] text-[10px] font-bold uppercase tracking-wider mt-1">{fileErrors.coverLetter}</p>
              ) : (
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">supports pdf, docx, txt (max 3mb)</p>
              )}
            </Field>
          </div>
        </div>

        {/* Right Column: Long Form Content */}
        <div className="flex-1 space-y-5">
          <Field label="Job Description">
            <TextArea rows={8} placeholder="Paste JD here..." value={form.jd} onChange={(value) => update("jd", value)} />
          </Field>

          <Field label="Notes">
            <TextArea rows={6} placeholder="Interview notes, follow-up reminders..." value={form.notes} onChange={(value) => update("notes", value)} />
          </Field>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10 transition-all">
            Cancel
          </button>
        )}
        <button disabled={saving} className="rounded-xl bg-[#FF6044] px-10 py-3 font-black text-[#121313] shadow-lg shadow-[#FF6044]/20 hover:bg-[#ff4d2e] hover:-translate-y-1 transition-all disabled:cursor-not-allowed disabled:opacity-70">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
