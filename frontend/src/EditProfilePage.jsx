import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, GraduationCap, Plus, Save, Trash2, Upload, UserRound } from "lucide-react";
import Header from "./Header";
import { API_BASE, apiUrl } from "./api";

const emptyEducation = {
  college: "",
  course: "",
  start_year: "",
  end_year: "",
};

const emptyExperience = {
  company: "",
  role: "",
  start_date: "",
  end_date: "",
  description: "",
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);

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

  useEffect(() => {
    fetch(apiUrl("/api/profile/"), {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load profile");
        }
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

    if (profilePic) {
      body.append("profile_pic", profilePic);
    }

    if (resume) {
      body.append("resume", resume);
    }

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
    setError(data.error || "Profile could not be saved.");
    setSaving(false);
  };

  if (!form.username && !error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-8 text-center">Loading profile editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Header />

      <main className="max-w-6xl mx-auto p-6 animate-fade-in-up">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-gray-500">Keep your profile ready for every application.</p>
          </div>

          <Link to="/profile">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow">
              <ArrowLeft size={18} /> Back
            </button>
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 text-red-600 border border-red-100 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white/85 rounded-2xl shadow p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              {form.profile_pic && !removeProfilePic ? (
                <img
                  src={`${API_BASE}${form.profile_pic}`}
                  className="w-28 h-28 rounded-full object-cover shadow border-4 border-white"
                  alt="Profile"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-900 text-white flex items-center justify-center shadow">
                  <UserRound size={42} />
                </div>
              )}

              <label className="mt-5 w-full cursor-pointer rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-blue-700 flex items-center justify-center gap-2">
                <Upload size={18} /> Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setProfilePic(e.target.files[0]);
                    setRemoveProfilePic(false);
                  }}
                />
              </label>

              {form.profile_pic && (
                <button
                  type="button"
                  onClick={() => setRemoveProfilePic(true)}
                  className="mt-3 text-sm text-red-500"
                >
                  Remove current photo
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <Input label="Username" value={form.username} onChange={(value) => updateField("username", value)} />
              <Input label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} />
              <Input label="Phone" value={form.phone} onChange={(value) => updateField("phone", value)} />
              <Input label="Age" type="number" value={form.age} onChange={(value) => updateField("age", value)} />
              <label className="block">
                <span className="text-sm font-medium text-gray-600">Gender</span>
                <select
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-200"
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-6">
            <Panel title="Professional Details" icon={<BriefcaseBusiness size={20} />}>
              <Textarea label="Skills" value={form.skills} onChange={(value) => updateField("skills", value)} placeholder="React, Django, SQL, Communication" />

              <label className="block mt-4">
                <span className="text-sm font-medium text-gray-600">Resume</span>
                <input
                  type="file"
                  className="mt-1 w-full rounded-xl border bg-white p-3"
                  onChange={(e) => setResume(e.target.files[0])}
                />
                {form.resume && <span className="text-xs text-gray-500 mt-2 block">Current resume is already uploaded.</span>}
              </label>
            </Panel>

            <Panel title="Education" icon={<GraduationCap size={20} />}>
              <div className="space-y-4">
                {form.educations.map((edu, index) => (
                  <div key={index} className="rounded-xl border bg-gray-50 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Education {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeRow("educations", index, emptyEducation)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input label="Course" value={edu.course} onChange={(value) => updateList("educations", index, "course", value)} />
                      <Input label="College" value={edu.college} onChange={(value) => updateList("educations", index, "college", value)} />
                      <Input label="Start Year" value={edu.start_year} onChange={(value) => updateList("educations", index, "start_year", value)} />
                      <Input label="End Year" value={edu.end_year} onChange={(value) => updateList("educations", index, "end_year", value)} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addRow("educations", emptyEducation)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700"
              >
                <Plus size={18} /> Add Education
              </button>
            </Panel>

            <Panel title="Experience" icon={<BriefcaseBusiness size={20} />}>
              <div className="space-y-4">
                {form.experiences.map((exp, index) => (
                  <div key={index} className="rounded-xl border bg-gray-50 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Experience {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeRow("experiences", index, emptyExperience)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input label="Role" value={exp.role} onChange={(value) => updateList("experiences", index, "role", value)} />
                      <Input label="Company" value={exp.company} onChange={(value) => updateList("experiences", index, "company", value)} />
                      <Input label="Start Date" value={exp.start_date} onChange={(value) => updateList("experiences", index, "start_date", value)} />
                      <Input label="End Date" value={exp.end_date} onChange={(value) => updateList("experiences", index, "end_date", value)} />
                    </div>
                    <div className="mt-3">
                      <Textarea label="Description" value={exp.description} onChange={(value) => updateList("experiences", index, "description", value)} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addRow("experiences", emptyExperience)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700"
              >
                <Plus size={18} /> Add Experience
              </button>
            </Panel>

            <div className="flex justify-end pb-8">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow disabled:opacity-60"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="bg-white/85 rounded-2xl shadow p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">{icon}{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}
