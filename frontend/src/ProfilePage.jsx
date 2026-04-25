import { useEffect, useState } from "react";
import Header from "./Header";

export default function ProfilePage() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/profile/")
      .then(res => {
        if (!res.ok) {
          throw new Error("API error");
        }
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, []);

  // ❌ API ERROR
  if (error) {
    return <p className="p-8 text-red-500">Error loading profile</p>;
  }

  // ⏳ LOADING
  if (!data) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="max-w-4xl mx-auto p-8">

        {/* TOP */}
        <div className="text-center mb-8">

          {data.profile_pic ? (
            <img
              src={`http://127.0.0.1:8000${data.profile_pic}`}
              className="w-28 h-28 rounded-full mx-auto"
            />
          ) : (
            <p>No Profile Picture</p>
          )}

          <h2 className="text-2xl font-bold mt-4">{data.username}</h2>

          <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">
            Edit Profile
          </button>
        </div>

        <hr className="mb-6" />

        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div>
            <h3 className="font-semibold mb-3">Basic Info</h3>

            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Age:</strong> {data.age}</p>
            <p><strong>Gender:</strong> {data.gender}</p>
          </div>

          {/* RIGHT */}
          <div>

            <h3 className="font-semibold mb-3">Professional Details</h3>

            <p className="font-medium">Education:</p>

            {data.educations.length === 0 ? (
              <p>No education added</p>
            ) : (
              data.educations.map((edu, i) => (
                <div key={i} className="mb-3 border-b pb-2">
                  <strong>{edu.course}</strong><br />
                  {edu.college}<br />
                  {edu.start_year} - {edu.end_year}
                </div>
              ))
            )}

            <p className="font-medium mt-4">Experience:</p>

            {data.experiences.length === 0 ? (
              <p>No experience added</p>
            ) : (
              data.experiences.map((exp, i) => (
                <div key={i} className="mb-3 border-b pb-2">
                  <strong>{exp.role}</strong><br />
                  {exp.company}<br />
                  {exp.start_date} - {exp.end_date}<br />
                  {exp.description}
                </div>
              ))
            )}

            <p className="font-medium mt-4">Skills:</p>
            <p>{data.skills}</p>

            <h4 className="mt-4 font-medium">Resume</h4>

            {data.resume ? (
              <a
                href={`http://127.0.0.1:8000${data.resume}`}
                target="_blank"
                rel="noreferrer"
              >
                <button className="mt-2 px-3 py-2 bg-blue-500 text-white rounded">
                  View Resume
                </button>
              </a>
            ) : (
              <p>No resume uploaded</p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}