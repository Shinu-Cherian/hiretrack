import { Link } from 'react-router-dom';
import {
  Briefcase, Users, LayoutDashboard, Plus,
  ListChecks, Sparkles, ShieldCheck, Zap
} from 'lucide-react';

const modules = [
  { icon: Plus, title: 'Add Job', to: '/add-job', desc: 'Log every application with role, company, JD, status and date.' },
  { icon: ListChecks, title: 'View Jobs', to: '/jobs', desc: 'Search, filter and update your application pipeline.' },
  { icon: Users, title: 'Add Referral', to: '/add-referral', desc: 'Record who you asked for a referral.' },
  { icon: Briefcase, title: 'View Referrals', to: '/referrals', desc: 'See referral statuses at a glance.' },
  { icon: LayoutDashboard, title: 'Dashboard', to: '/dashboard', desc: 'Visualise acceptance and response rates.' },
];

const features = [
  { icon: Sparkles, title: 'Smart Insights', desc: 'Automatic suggestions on follow-ups.' },
  { icon: ShieldCheck, title: 'Private by Default', desc: 'Your data stays safe.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Fast modern interface.' },
];

export default function Home() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="sticky top-0 glass">
        <div className="flex justify-between items-center p-4">

          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Briefcase /> HireTrack
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded">
                    Dashboard
                  </button>
                </Link>

                <img
                  src="/default-avatar.png"
                  className="w-8 h-8 rounded-full border"
                />
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm">Login</button>
                </Link>

                <Link to="/signup">
                  <button className="px-4 py-2 bg-black text-white rounded">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
       

      {/* HERO */}
      <section className="relative overflow-hidden py-32 text-center bg-gradient-subtle">

        <h1 className="text-5xl font-bold animate-fade-in-up">
          Track every application & referral in{" "}
          <span className="text-blue-600">one place</span>
        </h1>

        <p className="mt-4 text-gray-600 animate-fade-in-up">
          HireTrack keeps your job applications, referral requests, and follow-ups organised — with a clean dashboard, charts, and insights that tell you exactly what to do next.
        </p>

        <div className="mt-8 flex gap-4 justify-center animate-fade-in-up">

          {isLoggedIn ? (
            <Link to="/dashboard">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                Go to Dashboard →
              </button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <button className="px-6 py-3 bg-gradient-hero text-white rounded-lg">
                  Get Started →
                </button>
              </Link>

              <Link to="/login">
                <button className="px-6 py-3 border rounded-lg">
                  I already have an account
                </button>
              </Link>
            </>
          )}

        </div>
      </section>

      {/* MODULES (UNCHANGED) */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need, modular
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((m, i) => (
            <Link key={i} to={m.to} className="group">
              <div className="relative p-6 rounded-xl bg-white shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10">
                  <m.icon className="mb-4 text-primary" size={28} />
                  <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
                  <p className="text-sm text-gray-600">{m.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES (UNCHANGED) */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Built for serious job seekers
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group">
              <div className="relative p-6 rounded-xl bg-white shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-4">
                    <f.icon size={28} className="text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="py-24 px-6">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT SIDE */}
    <div>
      <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full mb-4">
        ❤️ About HireTrack
      </span>

      <h2 className="text-4xl font-bold mb-4">
        A calmer way to job hunt
      </h2>

      <p className="text-gray-600 mb-6">
        HireTrack started as a personal tool to stop losing track of applications across spreadsheets, emails and DMs. 
        It is now a focused workspace that brings together <b>jobs, referrals and a dashboard</b> with insights.
      </p>

      <ul className="space-y-2 text-gray-700">
        <li>• Track applications with status, JD, dates and notes.</li>
        <li>• Manage referral requests and follow-ups in one list.</li>
        <li>• Visualise progress with charts and smart insights.</li>
      </ul>
    </div>

    {/* RIGHT SIDE CARD */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500 text-sm">Applied</p>
          <h3 className="text-2xl font-bold">42</h3>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500 text-sm">Acceptance</p>
          <h3 className="text-2xl font-bold text-green-600">18%</h3>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500 text-sm">Referrals</p>
          <h3 className="text-2xl font-bold">12</h3>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500 text-sm">Pending</p>
          <h3 className="text-2xl font-bold text-orange-500">9</h3>
        </div>

      </div>

      {/* SIMPLE GRAPH */}
      <div className="h-24 bg-blue-100 rounded-lg flex items-end gap-2 p-2">
        {[40,60,30,70,50,80,60,50,75,45,65,85].map((h, i) => (
          <div key={i} className="bg-blue-500 w-3 rounded" style={{height: `${h}%`}} />
        ))}
      </div>

    </div>

  </div>
</section>

      {/* FOOTER */}
      <footer className="text-center p-6 text-gray-500">
        © {new Date().getFullYear()} HireTrack ❤️
      </footer>

    </div>
  );
}