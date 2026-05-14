import CustomDatePicker from "./CustomDatePicker";

export function Field({ label, wide = false, children }) {
  return (
    <div className={wide ? "md:col-span-2" : "flex flex-col"}>
      <span className="mb-2 block text-sm font-bold text-gray-400">{label}</span>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, type = "text", required = false, autoFocus = false, placeholder = "" }) {
  if (type === "date") {
    return <CustomDatePicker value={value} onChange={onChange} placeholder={placeholder} />;
  }

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
