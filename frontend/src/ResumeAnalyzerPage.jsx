import Header from "./Header";
import BackButton from "./components/BackButton";
import ResumeAnalyzer from "./components/ResumeAnalyzer";

export default function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Header />
      <main className="mx-auto max-w-6xl p-6">
        <BackButton className="mb-5" />
        <ResumeAnalyzer />
      </main>
    </div>
  );
}
