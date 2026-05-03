import Header from "./Header";
import BackButton from "./components/BackButton";
import CoverLetterGenerator from "./components/CoverLetterGenerator";

export default function CoverLetterPage() {
  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">
      <Header />
      <main className="mx-auto max-w-6xl p-6">
        <BackButton className="mb-5" />
        <CoverLetterGenerator />
      </main>
    </div>
  );
}
