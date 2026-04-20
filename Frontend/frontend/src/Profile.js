import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL
function Profile() {
  const [data, setData] = useState({
    totalUploads: 0,
    totalLikes: 0,
    totalDownloads: 0,
    resources: []
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/resources/my`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.resources) {
          setData(result);
        } else {
          setError(result.message || result.error || "Failed to load profile");
        }
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, []);

  const chartData = [
    { name: "Uploads", value: data.totalUploads },
    { name: "Likes", value: data.totalLikes },
    { name: "Downloads", value: data.totalDownloads }
  ];

  if (error) {
    return (
      <DashboardLayout title="My Profile">
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-2xl p-4">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile">
      <div className="mb-10">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-extrabold mb-2">
            Welcome back 👋
          </h2>
          <p className="text-gray-100">
            Manage your uploads, track engagement, and keep your resources updated.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-6 shadow-lg">
          <p className="text-sm opacity-90">Total Uploads</p>
          <h2 className="text-4xl font-extrabold mt-3">{data.totalUploads}</h2>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-6 shadow-lg">
          <p className="text-sm opacity-90">Total Likes</p>
          <h2 className="text-4xl font-extrabold mt-3">{data.totalLikes}</h2>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl p-6 shadow-lg">
          <p className="text-sm opacity-90">Total Downloads</p>
          <h2 className="text-4xl font-extrabold mt-3">{data.totalDownloads}</h2>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          📊 Analytics Overview
        </h2>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Resources
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data.resources.length} resource{data.resources.length !== 1 ? "s" : ""}
        </p>
      </div>

      {data.resources.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No uploaded resources yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {data.resources.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {r.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {r.description}
                  </p>
                </div>

                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  PDF
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Downloads
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    ⬇ {r.downloads || 0}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Likes
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    ⭐ {r.likes || 0}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    const newTitle = prompt("Enter new title", r.title);
                    const newDescription = prompt("Enter new description", r.description);

                    if (!newTitle || !newDescription) return;

                    await fetch(`${API_URL}/api/resources/${r._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token")
                      },
                      body: JSON.stringify({
                        title: newTitle,
                        description: newDescription
                      })
                    });

                    window.location.reload();
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    await fetch(`${API_URL}/api/resources/${r._id}`, {
                      method: "DELETE"
                    });

                    window.location.reload();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition font-medium"
                >
                  Delete
                </button>

                <a
                  href={`${API_URL}/uploads/${r.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition font-medium"
                >
                  View File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;