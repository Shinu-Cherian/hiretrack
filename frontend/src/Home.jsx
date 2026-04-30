import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  LayoutDashboard,
  ListChecks,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  FileSearch,
  PenLine,
} from "lucide-react";
import Header from "./Header";

const modules = [
  { icon: Plus, title: "Add Job", to: "/add-job", desc: "Log company, role, JD, status, notes, and follow-up date." },
  { icon: ListChecks, title: "View Jobs", to: "/jobs", desc: "Search, edit, star, and manage your application pipeline." },
  { icon: Users, title: "Add Referral", to: "/add-referral", desc: "Record referral requests with person, company, date, and status." },
  { icon: Briefcase, title: "View Referrals", to: "/referrals", desc: "Track who replied, who is pending, and who needs a nudge." },
  { icon: LayoutDashboard, title: "Dashboard", to: "/dashboard", desc: "Visualize progress with clean charts and useful insights." },
  { icon: FileSearch, title: "ATS Resume Analyzer", to: "/resume-analyzer", desc: "Compare your resume to a JD and see missing keywords." },
  { icon: PenLine, title: "Cover Letter Generator", to: "/cover-letter", desc: "Create a structured cover letter draft from your resume and JD." },
];

const features = [
  { icon: Sparkles, title: "Smart Insights", desc: "See what needs attention without reading every row yourself." },
  { icon: ShieldCheck, title: "Private Workspace", desc: "Each logged-in user sees only their own jobs, referrals, and profile." },
  { icon: Zap, title: "Fast Updates", desc: "Edit jobs and referrals instantly from the list view." },
];

export default function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="min-h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <Header />

      <section className="relative min-h-screen snap-start flex items-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-70" />
        <div className="pointer-events-none absolute top-24 left-10 h-40 w-40 rounded-full bg-blue-200 blur-3xl opacity-50" />
        <div className="pointer-events-none absolute bottom-24 right-10 h-48 w-48 rounded-full bg-emerald-200 blur-3xl opacity-50" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="text-center lg:text-left animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow text-blue-700 text-sm font-medium">
              <Sparkles size={16} /> Calm, visual job tracking
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
              Track every application & referral in{" "}
              <span className="text-blue-600">one place</span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg max-w-xl mx-auto lg:mx-0">
              HireTrack keeps your jobs, referrals, follow-ups, profile, and analytics organized with a clean dashboard that shows what to do next.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg">
                    Go to Dashboard <ArrowRight size={18} />
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg">
                      Get Started <ArrowRight size={18} />
                    </button>
                  </Link>

                  <Link to="/login">
                    <button className="px-6 py-3 bg-white border rounded-xl shadow-sm">
                      I already have an account
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="animate-fade-in-up">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="min-h-screen snap-start flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need, modular</h2>
            <p className="text-gray-500 mt-3">Open exactly the workspace you need and keep moving.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
            {modules.map((module, i) => (
              <Link key={module.title} to={module.to} className="group">
                <div className="relative h-full p-5 rounded-2xl bg-white/85 shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400" />
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 transition group-hover:scale-110">
                    <module.icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.desc}</p>
                  <span className="mt-4 inline-flex text-sm text-blue-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition" style={{ transitionDelay: `${i * 20}ms` }}>
                    Open <ArrowRight size={16} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-screen snap-start flex items-center py-20 px-6 bg-white/60">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Built for serious job seekers</h2>
            <p className="text-gray-500 mt-3">Simple enough for daily use, visual enough to stay motivated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center group-hover:rotate-3 transition">
                    <feature.icon size={26} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-screen snap-start flex items-center py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full mb-4">
              <Briefcase size={16} /> About HireTrack
            </span>

            <h2 className="text-4xl font-bold mb-4">A calmer way to job hunt</h2>

            <p className="text-gray-600 mb-6">
              HireTrack brings together applications, referrals, reminders, profile details, and dashboard insights so your search feels organized instead of scattered.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3"><span className="text-blue-600">•</span> Track applications with status, JD, dates and notes.</li>
              <li className="flex gap-3"><span className="text-blue-600">•</span> Manage referral requests and follow-ups in one list.</li>
              <li className="flex gap-3"><span className="text-blue-600">•</span> Visualize progress with charts, rates, and reminders.</li>
            </ul>
          </div>

          <div className="bg-white/90 p-6 rounded-2xl shadow-xl animate-fade-in-up">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <MiniCard label="Applied" value="42" />
              <MiniCard label="Acceptance" value="18%" tone="green" />
              <MiniCard label="Referrals" value="12" />
              <MiniCard label="Pending" value="9" tone="orange" />
            </div>

            <div className="h-32 bg-blue-50 rounded-2xl flex items-end gap-2 p-4">
              {[40, 60, 30, 70, 50, 80, 60, 50, 75, 45, 65, 85].map((height, i) => (
                <div key={i} className="bg-blue-500 flex-1 rounded-t animate-rise" style={{ height: `${height}%`, animationDelay: `${i * 60}ms` }} />
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              <PreviewRow icon={<Bell size={16} />} text="Follow up with pending applications" />
              <PreviewRow icon={<BarChart3 size={16} />} text="Referral reply rate improved this week" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-0 bg-blue-300 blur-3xl opacity-30 rounded-full" />
      <div className="relative bg-white/90 rounded-2xl shadow-2xl p-5 border border-white overflow-hidden">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-sm text-gray-500">Dashboard preview</p>
            <h3 className="font-bold text-xl">This month</h3>
          </div>
          <LayoutDashboard className="text-blue-600" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <MiniCard label="Jobs" value="24" />
          <MiniCard label="Selected" value="5" tone="green" />
          <MiniCard label="Replies" value="8" tone="orange" />
        </div>

        <div className="h-44 rounded-2xl bg-gray-50 p-4 flex items-end gap-2">
          {[35, 55, 42, 72, 58, 88, 65, 78, 60].map((height, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-lg animate-rise" style={{ height: `${height}%`, animationDelay: `${i * 70}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value, tone = "blue" }) {
  const toneClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-500",
  }[tone];

  return (
    <div className="p-4 border rounded-xl bg-white">
      <p className="text-gray-500 text-sm">{label}</p>
      <h3 className={`text-2xl font-bold ${toneClass}`}>{value}</h3>
    </div>
  );
}

function PreviewRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
      <span className="text-blue-600">{icon}</span>
      {text}
    </div>
  );
}
