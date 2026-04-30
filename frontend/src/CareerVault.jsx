import { useEffect, useState } from "react";
import { Download, Eye } from "lucide-react";
import Header from "./Header";
import { API_BASE, apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";

export default function CareerVault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/career-vault/"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Header />
      <main className="mx-auto max-w-7xl p-6">
        <BackButton className="mb-5" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-950">Career Vault</h1>
          <p className="mt-1 text-gray-500">Only applications with uploaded documents appear here.</p>
        </div>

        <Card className="overflow-hidden">
          <div className="hidden grid-cols-5 gap-4 border-b border-gray-100 p-4 text-sm font-semibold text-gray-500 lg:grid">
            <span className="col-span-2">Job</span>
            <span>Applied Date</span>
            <span>Resume Used</span>
            <span>Cover Letter Used</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading vault...</div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No resume to show. Upload a resume or cover letter while adding a job.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 gap-4 border-b border-gray-100 p-4 last:border-b-0 lg:grid-cols-5 lg:items-center">
                <div className="lg:col-span-2">
                  <p className="font-semibold text-gray-950">{item.jobTitle}</p>
                  <p className="text-sm text-gray-500">{item.company}</p>
                </div>
                <span className="text-sm text-gray-600">{item.dateApplied || "-"}</span>
                <DocumentActions file={item.resumeFile} download={item.resumeDownload} empty="No resume" />
                <DocumentActions file={item.coverLetterFile} download={item.coverLetterDownload} empty="No cover letter" />
              </div>
            ))
          )}
        </Card>
      </main>
    </div>
  );
}

function DocumentActions({ file, download, empty }) {
  if (!file) return <span className="text-sm text-gray-400">{empty}</span>;
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`${API_BASE}${file}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
        <Eye size={15} /> Preview
      </a>
      <a href={`${API_BASE}${download}`} className="inline-flex items-center gap-1 rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800">
        <Download size={15} /> Download
      </a>
    </div>
  );
}
