import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL;

function Bookmarks() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/resources/bookmarks`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setError(data.message || "Failed to load bookmarks");
        }
      })
      .catch(() => setError("Something went wrong"));
  }, []);

  return (
    <DashboardLayout title="My Bookmarks">

      {/* HEADER */}
      <div className="mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold">📌 Saved Resources</h2>
        <p className="text-yellow-100 mt-2">
          Quickly access your bookmarked study materials
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {resources.length === 0 && !error ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No bookmarks yet 📭
          </p>
        </div>
      ) : (

        /* GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {resources.map((r) => (

            <div
              key={r._id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition"
            >
              
              {/* TITLE */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {r.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {r.description}
              </p>

              {/* STATS */}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p>⬇ {r.downloads || 0}</p>
                <p>⭐ {r.likes || 0}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">

                <a
                  href={`${API_URL}/uploads/${r.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  View
                </a>

                <button
                  onClick={async () => {
                    await fetch(`${API_URL}/api/resources/bookmark/${r._id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: localStorage.getItem("token")
                      }
                    });

                    setResources(resources.filter(item => item._id !== r._id));
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </DashboardLayout>
  );
}

export default Bookmarks;