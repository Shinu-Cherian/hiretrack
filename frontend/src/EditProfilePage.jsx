import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BriefcaseBusiness, GraduationCap, Mail, Pencil, Phone, 
  Plus, Save, Sparkles, Trash2, Upload, UserRound, Search, ChevronDown
} from "lucide-react";
import Header from "./Header";
import { API_BASE, apiUrl } from "./api";
import Avatar from "./components/Avatar";
import BackButton from "./components/BackButton";

const emptyEducation = { college: "", course: "", start_year: "", end_year: "" };
const emptyExperience = { company: "", role: "", start_date: "", end_date: "", description: "" };

const countryData = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "+242", flag: "🇨🇬" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Grenada", code: "+1-473", flag: "🇬🇩" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Jamaica", code: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vatican City", code: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" }
];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    skills: "",
    profile_pic: "",
    resume: "",
    educations: [emptyEducation],
    experiences: [emptyExperience],
  });

  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/profile/"), { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load profile");
        return res.json();
      })
      .then((data) => {
        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          age: data.age || "",
          gender: data.gender || "",
          skills: data.skills || "",
          profile_pic: data.profile_pic || "",
          resume: data.resume || "",
          educations: data.educations?.length ? data.educations : [emptyEducation],
          experiences: data.experiences?.length ? data.experiences : [emptyExperience],
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load profile details.");
      });
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateList = (listName, index, field, value) => {
    setForm((current) => ({
      ...current,
      [listName]: current[listName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addRow = (listName, emptyValue) => {
    setForm((current) => ({
      ...current,
      [listName]: [...current[listName], { ...emptyValue }],
    }));
  };

  const removeRow = (listName, index, emptyValue) => {
    setForm((current) => {
      const next = current[listName].filter((_, i) => i !== index);
      return { ...current, [listName]: next.length ? next : [{ ...emptyValue }] };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const body = new FormData();
    body.append("username", form.username);
    body.append("email", form.email);
    body.append("phone", form.phone);
    body.append("age", form.age);
    body.append("gender", form.gender);
    body.append("skills", form.skills);
    body.append("remove_profile_pic", removeProfilePic ? "true" : "false");

    if (profilePic) body.append("profile_pic", profilePic);
    if (resume) body.append("resume", resume);

    form.educations.forEach((edu) => {
      body.append("education_college", edu.college || "");
      body.append("education_course", edu.course || "");
      body.append("education_start", edu.start_year || "");
      body.append("education_end", edu.end_year || "");
    });

    form.experiences.forEach((exp) => {
      body.append("experience_company", exp.company || "");
      body.append("experience_role", exp.role || "");
      body.append("experience_start", exp.start_date || "");
      body.append("experience_end", exp.end_date || "");
      body.append("experience_desc", exp.description || "");
    });

    const res = await fetch(apiUrl("/api/profile/update/"), {
      method: "POST",
      credentials: "include",
      body,
    });

    if (res.ok) {
      localStorage.setItem("username", form.username || "User");
      navigate("/profile");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setError(data.error || "Something went wrong.");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />

      <main className="mx-auto max-w-7xl p-6 animate-fade-in-up">
        <BackButton className="mb-5" />

        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">Edit Profile</h1>
          <p className="text-gray-400 mt-2">Update your personal and professional information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="saas-card p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              {form.profile_pic && !removeProfilePic ? (
                <img src={`${API_BASE}${form.profile_pic}`} className="w-28 h-28 rounded-full object-cover shadow border-4 border-white" alt="Profile" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-900 text-white flex items-center justify-center shadow">
                  <UserRound size={42} />
                </div>
              )}

              <label className="mt-5 w-full cursor-pointer rounded-xl border border-dashed border-[#FF6044]/30 bg-[#FF6044]/5 px-4 py-3 text-[#FF6044] flex items-center justify-center gap-2 font-bold hover:bg-[#FF6044]/10 transition-all">
                <Upload size={18} /> Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { setProfilePic(e.target.files[0]); setRemoveProfilePic(false); }} />
              </label>

              {form.profile_pic && (
                <button type="button" onClick={() => setRemoveProfilePic(true)} className="mt-3 text-sm text-red-500">
                  Remove current photo
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <Input label="Username" value={form.username} onChange={(value) => updateField("username", value)} />
              <Input label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} />
              
              <PhoneInput 
                value={form.phone} 
                onChange={(value) => updateField("phone", value)} 
              />

              <Input label="Age" type="number" value={form.age} onChange={(value) => updateField("age", value)} />
              <label className="block">
                <span className="text-sm font-medium text-gray-400">Gender</span>
                <select
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#1a1b1b] text-white p-3 outline-none focus:ring-2 focus:ring-[#FF6044]/30 focus:border-[#FF6044]/50 transition-all"
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="" className="bg-[#1a1b1b]">Select gender</option>
                  <option value="Male" className="bg-[#1a1b1b]">Male</option>
                  <option value="Female" className="bg-[#1a1b1b]">Female</option>
                  <option value="Other" className="bg-[#1a1b1b]">Other</option>
                </select>
              </label>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-6">
            <Panel title="Professional Details" icon={<BriefcaseBusiness size={20} />}>
              <Textarea label="Skills" value={form.skills} onChange={(value) => updateField("skills", value)} placeholder="React, Django, SQL, Communication" />

              <label className="block mt-4">
                <span className="text-sm font-medium text-gray-400">Resume</span>
                <input
                  type="file"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#1a1b1b] text-gray-400 p-3 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#FF6044] file:text-[#121313] file:font-black file:text-xs file:uppercase file:tracking-wider hover:file:bg-[#ff4d2e] transition-all"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </label>
            </Panel>

            <Panel title="Education" icon={<GraduationCap size={20} />}>
              <div className="space-y-6">
                {form.educations.map((edu, i) => (
                  <div key={i} className="relative p-4 rounded-xl bg-white/5 border border-white/5 group">
                    <button type="button" onClick={() => removeRow("educations", i, emptyEducation)} className="absolute -right-2 -top-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="College" value={edu.college} onChange={(v) => updateList("educations", i, "college", v)} />
                      <Input label="Course" value={edu.course} onChange={(v) => updateList("educations", i, "course", v)} />
                      <Input label="Start Year" value={edu.start_year} onChange={(v) => updateList("educations", i, "start_year", v)} />
                      <Input label="End Year" value={edu.end_year} onChange={(v) => updateList("educations", i, "end_year", v)} />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addRow("educations", emptyEducation)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all">
                <Plus size={18} /> Add Education
              </button>
            </Panel>

            <Panel title="Experience" icon={<BriefcaseBusiness size={20} />}>
              <div className="space-y-6">
                {form.experiences.map((exp, i) => (
                  <div key={i} className="relative p-4 rounded-xl bg-white/5 border border-white/5 group">
                    <button type="button" onClick={() => removeRow("experiences", i, emptyExperience)} className="absolute -right-2 -top-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Company" value={exp.company} onChange={(v) => updateList("experiences", i, "company", v)} />
                      <Input label="Role" value={exp.role} onChange={(v) => updateList("experiences", i, "role", v)} />
                      <Input label="Start Date" value={exp.start_date} onChange={(v) => updateList("experiences", i, "start_date", v)} />
                      <Input label="End Date" value={exp.end_date} onChange={(v) => updateList("experiences", i, "end_date", v)} />
                      <div className="md:col-span-2">
                        <Textarea label="Description" value={exp.description} onChange={(v) => updateList("experiences", i, "description", v)} rows={3} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addRow("experiences", emptyExperience)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all">
                <Plus size={18} /> Add Experience
              </button>
            </Panel>

            <div className="flex justify-end pb-8">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#FF6044] text-[#121313] px-8 py-3 rounded-xl font-extrabold shadow-lg shadow-[#FF6044]/20 hover:bg-[#ff4d2e] hover:shadow-[#FF6044]/40 hover:-translate-y-1 transition-all disabled:opacity-60">
                <Save size={18} /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-400">{label}</span>
      <input
        type={type}
        className="mt-1 w-full rounded-xl border border-white/10 bg-[#1a1b1b] text-white p-3 outline-none focus:ring-2 focus:ring-[#FF6044]/30 focus:border-[#FF6044]/50 transition-all"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-400">{label}</span>
      <textarea
        rows={rows}
        className="mt-1 w-full rounded-xl border border-white/10 bg-[#1a1b1b] text-white p-3 outline-none focus:ring-2 focus:ring-[#FF6044]/30 focus:border-[#FF6044]/50 transition-all resize-none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function PhoneInput({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const currentCode = countryData.find(c => value.startsWith(c.code))?.code || "+91";
  const numberPart = value.startsWith(currentCode) ? value.slice(currentCode.length).trim() : value;

  const filteredCountries = countryData.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCountry = (code) => {
    onChange(`${code} ${numberPart}`);
    setIsOpen(false);
  };

  const handleNumberChange = (e) => {
    onChange(`${currentCode} ${e.target.value}`);
  };

  return (
    <div className="block">
      <span className="text-sm font-medium text-gray-400">Phone</span>
      <div className="mt-1 flex gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-[50px] flex items-center gap-2 px-3 rounded-xl border border-white/10 bg-[#1a1b1b] text-white hover:border-[#FF6044]/50 transition-all min-w-[100px]"
          >
            <span className="text-lg">{countryData.find(c => c.code === currentCode)?.flag}</span>
            <span className="font-bold">{currentCode}</span>
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl border border-white/10 bg-[#1a1b1b] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-3 border-b border-white/5 bg-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search country..."
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FF6044]/50 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => selectCountry(c.code)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FF6044]/10 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.flag}</span>
                        <span className="text-sm font-medium text-gray-200">{c.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#FF6044]">{c.code}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm italic">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          type="tel"
          className="h-[50px] flex-1 rounded-xl border border-white/10 bg-[#1a1b1b] text-white p-3 outline-none focus:ring-2 focus:ring-[#FF6044]/30 focus:border-[#FF6044]/50 transition-all"
          value={numberPart}
          placeholder="Phone number"
          onChange={handleNumberChange}
        />
      </div>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="saas-card p-6">
      <h2 className="font-black text-white text-base mb-5 flex items-center gap-2">
        <span className="text-[#FF6044]">{icon}</span>{title}
      </h2>
      {children}
    </div>
  );
}
