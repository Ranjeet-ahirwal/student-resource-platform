import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

const API_URL = "http://localhost:5000";

function Admin() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/resources/admin/all`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setError(data.message || "Failed to load admin resources");
        }
      })
      .catch(() => setError("Something went wrong"));
  }, []);

  if (error) {
    return (
      <DashboardLayout title="Admin Panel">
        <p className="text-red-600">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Panel">
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <p className="text-gray-500">Total Resources</p>
        <h2 className="text-3xl font-bold text-blue-600 mt-2">
          {resources.length}
        </h2>
      </div>

      {resources.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-6 text-gray-500">
          No resources found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((r) => (
            <div key={r._id} className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800">{r.title}</h3>
              <p className="text-gray-600 mt-2">{r.description}</p>

              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>⬇ Downloads: {r.downloads || 0}</p>
                <p>⭐ Likes: {r.likes || 0}</p>
                <p>📄 File: {r.file}</p>
              </div>

              <button
                onClick={async () => {
                  await fetch(`${API_URL}/api/resources/${r._id}`, {
                    method: "DELETE"
                  });
                  setResources(resources.filter((item) => item._id !== r._id));
                }}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete Resource
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Admin;