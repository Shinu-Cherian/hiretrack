export function Field({ label, wide = false, children }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-bold text-gray-400">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ value, onChange, type = "text", required = false, autoFocus = false, placeholder = "" }) {
  return (
    <input
      type={type}
      required={required}
      autoFocus={autoFocus}
      placeholder={placeholder}
      className="form-input"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function TextArea({ value, onChange, placeholder = "", rows = 4 }) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="form-input resize-y"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function SelectInput({ value, onChange, children }) {
  return (
    <select className="form-input" value={value || ""} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  );
}
