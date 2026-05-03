import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, GraduationCap, Mail, Pencil, Phone, Sparkles, UserRound } from "lucide-react";
import Header from "./Header";
import { API_BASE, apiUrl } from "./api";
import Avatar from "./components/Avatar";
import BackButton from "./components/BackButton";

export default function ProfilePage() {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/profile/"), {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error("Please login again to view your profile.");
        }
        if (!res.ok) {
          throw new Error("Error loading profile");
        }
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // ❌ API ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-8 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-8 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">

      <Header />

      <main className="max-w-6xl mx-auto p-6 animate-fade-in-up">
        <BackButton className="mb-5" isMenu={true} />
        <section className="saas-card overflow-hidden">
          <div className="h-32 bg-gray-100 border-b border-gray-200/50" />

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 -mt-14">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <Avatar src={data.profile_pic} username={data.username} size="lg" className="border-4 border-white shadow-lg" />

                <div className="pb-2">
                  <h1 className="text-3xl font-bold">{data.username}</h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {data.email || "No email added"}
                  </p>
                </div>
              </div>

              <Link to="/profile/edit">
                <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-sm hover:bg-gray-800 transition-colors">
                  <Pencil size={18} /> Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="saas-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <UserRound size={20} /> Basic Info
            </h2>
            <Info label="Phone" value={data.phone} icon={<Phone size={16} />} />
            <Info label="Age" value={data.age} />
            <Info label="Gender" value={data.gender} />
          </div>

          <div className="lg:col-span-2 saas-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles size={20} /> Skills
            </h2>
            {data.skills ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.split(",").map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added</p>
            )}

            <h2 className="font-semibold text-lg mt-8 mb-4">Resume</h2>
            {data.resume ? (
              <a href={`${API_BASE}${data.resume}`} target="_blank" rel="noreferrer">
                <button className="px-4 py-2 bg-gray-900 text-white rounded-xl">View Resume</button>
              </a>
            ) : (
              <p className="text-gray-500">No resume uploaded</p>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-8">
          <Timeline title="Education" icon={<GraduationCap />} empty="No education added">
            {(data.educations || []).map((edu, i) => (
              <TimelineItem key={i} title={edu.course} subtitle={edu.college} meta={`${edu.start_year || "-"} - ${edu.end_year || "-"}`} />
            ))}
          </Timeline>

          <Timeline title="Experience" icon={<BriefcaseBusiness />} empty="No experience added">
            {(data.experiences || []).map((exp, i) => (
              <TimelineItem key={i} title={exp.role} subtitle={exp.company} meta={`${exp.start_date || "-"} - ${exp.end_date || "-"}`} note={exp.description} />
            ))}
          </Timeline>
        </section>
      </main>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex justify-between gap-4 border-b py-3 last:border-b-0">
      <span className="text-gray-500 flex items-center gap-2">{icon}{label}</span>
      <strong className="text-right">{value || "-"}</strong>
    </div>
  );
}

function Timeline({ title, icon, empty, children }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;

  return (
    <div className="saas-card p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">{icon}{title}</h2>
      {items && items.length > 0 ? <div className="space-y-4">{items}</div> : <p className="text-gray-500">{empty}</p>}
    </div>
  );
}

function TimelineItem({ title, subtitle, meta, note }) {
  return (
    <div className="border-l-4 border-gray-900 pl-4 py-1">
      <h3 className="font-semibold">{title || "-"}</h3>
      <p className="text-gray-600">{subtitle || "-"}</p>
      <p className="text-sm text-gray-400">{meta}</p>
      {note && <p className="text-sm text-gray-600 mt-2">{note}</p>}
    </div>
  );
}
