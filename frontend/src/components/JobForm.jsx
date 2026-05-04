import { useState } from "react";
import { Field, SelectInput, TextArea, TextInput } from "./FormFields";

const emptyJob = {
  jobTitle: "",
  company: "",
  jobId: "",
  platform: "",
  dateApplied: "",
  status: "applied",
  salaryRange: "",
  jd: "",
  notes: "",
  resume_file: null,
  cover_letter_file: null,
};

export default function JobForm({ initialValues = emptyJob, submitLabel = "Save Job", onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyJob, ...initialValues });
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
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
          <TextInput required type="date" value={form.dateApplied} onChange={(value) => update("dateApplied", value)} />
        </Field>

        <Field label="Status">
          <SelectInput value={form.status} onChange={(value) => update("status", value)}>
            <option value="applied">Applied</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="selected">Selected</option>
          </SelectInput>
        </Field>

        <Field label="Salary Range" wide>
          <TextInput placeholder="$100k - $150k" value={form.salaryRange} onChange={(value) => update("salaryRange", value)} />
        </Field>

        <Field label="Job Description" wide>
          <TextArea placeholder="Paste JD here..." value={form.jd} onChange={(value) => update("jd", value)} />
        </Field>

        <Field label="Notes" wide>
          <TextArea rows={3} placeholder="Interview notes, follow-up reminders..." value={form.notes} onChange={(value) => update("notes", value)} />
        </Field>

        <Field label="Resume Used">
          <input
            type="file"
            className="form-input"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(event) => update("resume_file", event.target.files?.[0] || null)}
          />
        </Field>

        <Field label="Cover Letter Used">
          <input
            type="file"
            className="form-input"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(event) => update("cover_letter_file", event.target.files?.[0] || null)}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-white/10 px-5 py-3 font-bold text-gray-400 hover:bg-white/5 transition-all">
            Cancel
          </button>
        )}
        <button disabled={saving} className="rounded-lg bg-[#FF6044] px-5 py-3 font-bold text-white shadow-lg shadow-[#FF6044]/20 hover:bg-[#ff4d2e] hover:shadow-[#FF6044]/40 hover:-translate-y-0.5 transition-all disabled:cursor-not-allowed disabled:opacity-70">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
