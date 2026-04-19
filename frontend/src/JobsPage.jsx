import { useState } from "react";

export default function JobsPage() {

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-gray-500 text-sm">0 applications tracked</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Job
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search jobs..."
        className="mt-4 p-2 border rounded w-full max-w-md"
      />

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-lg shadow">

        <div className="grid grid-cols-7 p-4 border-b text-sm text-gray-500">
          <span>Job Title</span>
          <span>Company</span>
          <span>Job ID</span>
          <span>Platform</span>
          <span>Date Applied</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="p-10 text-center text-gray-400">
          No jobs added yet. Click "Add Job" to get started.
        </div>

      </div>

      {/* MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">

    <div className="bg-white p-6 rounded-2xl w-full max-w-lg relative shadow-2xl animate-scaleIn">

      {/* CLOSE */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-6">Add New Job</h2>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">

        <input className="input" placeholder="Job Title" />
        <input className="input" placeholder="Company" />

        <input className="input" placeholder="Job ID" />
        <input className="input" placeholder="Platform" />

        <input type="date" className="input" />
        <input className="input" placeholder="Status" />

        <input className="input col-span-2" placeholder="Salary Range" />

        <textarea className="input col-span-2" placeholder="Job Description" />

        <textarea className="input col-span-2" placeholder="Notes" />

      </div>

      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
        Add Job
      </button>

    </div>
  </div>
)}
 </div>
  );
}