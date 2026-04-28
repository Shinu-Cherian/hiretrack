import { useState } from "react";
import { Field, SelectInput, TextArea, TextInput } from "./FormFields";

const emptyReferral = {
  person_name: "",
  company: "",
  email: "",
  linkedin: "",
  date: "",
  status: "pending",
  notes: "",
};

export default function ReferralForm({ initialValues = emptyReferral, submitLabel = "Save Referral", onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyReferral, ...initialValues });
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
        <Field label="Person Name *">
          <TextInput required autoFocus placeholder="John Doe" value={form.person_name} onChange={(value) => update("person_name", value)} />
        </Field>

        <Field label="Company *">
          <TextInput required placeholder="Google" value={form.company} onChange={(value) => update("company", value)} />
        </Field>

        <Field label="Email">
          <TextInput type="email" placeholder="john@email.com" value={form.email} onChange={(value) => update("email", value)} />
        </Field>

        <Field label="LinkedIn URL">
          <TextInput type="url" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(value) => update("linkedin", value)} />
        </Field>

        <Field label="Date Requested *">
          <TextInput required type="date" value={form.date} onChange={(value) => update("date", value)} />
        </Field>

        <Field label="Status">
          <SelectInput value={form.status} onChange={(value) => update("status", value)}>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="no_response">No Response</option>
          </SelectInput>
        </Field>

        <Field label="Notes" wide>
          <TextArea rows={4} placeholder="Context, intro message, follow-up notes..." value={form.notes} onChange={(value) => update("notes", value)} />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        )}
        <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
