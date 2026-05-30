import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, Send, User, ChevronRight, HelpCircle, CheckCircle2 } from "lucide-react";
import { apiUrl } from "./api";
import Header from "./Header";

export default function HelpCenter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(apiUrl("/api/contact-support/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    { q: "How do I add a new job?", a: "Navigate to your Dashboard and click the 'Add Job' button to start tracking a new application." },
    { q: "How does the Career Roadmap work?", a: "Based on your major and current year, our AI generates a customized timeline of skills to learn and roles to target." },
    { q: "How does the AI Resume Analyzer work?", a: "The AI reads your resume PDF and compares it against modern ATS standards, providing actionable feedback to improve your score." }
  ];

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 lg:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Side: Info & FAQ */}
        <div className="flex flex-col justify-center animate-fade-in-up">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] text-xs font-black uppercase tracking-widest mb-6">
              <HelpCircle size={14} />
              Direct Support
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight font-display">
              We are here to <br className="hidden lg:block"/>
              <span className="text-[#FF6044]">help you succeed.</span>
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-md">
              Need assistance with your account, have a feature request, or encountered an issue? Send our support team a direct message and we will resolve it promptly.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={16} className="text-[#FF6044]" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="saas-card p-6 bg-[#1a1b1b] border-white/5 hover:border-[#FF6044]/20 transition-all group">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <ChevronRight size={16} className="text-[#FF6044] group-hover:translate-x-1 transition-transform" />
                    {faq.q}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="flex flex-col justify-center">
          <div className="saas-card p-8 lg:p-10 bg-[#121313]/80 backdrop-blur-3xl border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Send us a message</h3>
            
            {success ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-8 text-center animate-fade-in-up">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-2">Message Received!</h4>
                <p className="text-sm text-green-400/80 mb-6">We've securely routed your message directly to our support inbox. We will get back to you via email shortly.</p>
                <button onClick={() => setSuccess(false)} className="text-xs font-black uppercase tracking-widest text-[#121313] bg-green-500 px-6 py-3 rounded-xl hover:bg-green-400 transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    placeholder="Describe your issue or feedback in detail..."
                    rows={5}
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting || !name || !email || !subject || !message}
                  className="group relative w-full bg-[#FF6044] text-[#121313] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,96,68,0.2)] hover:bg-[#ff4d2e] hover:shadow-[0_15px_40px_rgba(255,96,68,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 mt-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? "Sending Route..." : "Send Message"}
                    {!submitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
