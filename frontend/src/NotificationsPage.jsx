import { useEffect, useState } from "react";
import Header from "./Header";

export default function NotificationsPage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notifications/")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">🔔 Notifications</h1>

        <div className="bg-white rounded-xl shadow">

          {data.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No notifications
            </div>
          ) : (
            data.map((n, i) => (
              <div key={i} className="p-4 border-b">
                <p className="font-medium">{n.message}</p>
                <p className="text-sm text-gray-500">{n.date}</p>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}