import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Login";
import Signup from "./Signup";
import Upload from "./Upload";
import Admin from "./Admin";
import Bookmarks from "./Bookmarks";
import Profile from "./Profile";
import PdfPreview from "./PdfPreview";
import Chatbot from "./Chatbot";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [trending, setTrending] = useState([]);
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState({});
  const [editResource, setEditResource] = useState(null);
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const url = search
  ? `${API_URL}/api/resources/ai-search?query=${search}`
  : `${API_URL}/api/resources`;
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setResources([]);
        setLoading(false);
      });

    fetch(`${API_URL}/api/resources/trending`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTrending(data);
        } else {
          setTrending([]);
        }
      })
      .catch(() => setTrending([]));

    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/resources/recommendations`, {
        headers: {
          Authorization: token
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRecommended(data);
          } else {
            setRecommended([]);
          }
        })
        .catch(() => setRecommended([]));
    } else {
      setRecommended([]);
    }
  }, [search]);

  const filteredResources = Array.isArray(resources)
    ? resources.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const renderHomePage = () => (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24 px-6 text-center rounded-b-[40px] shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            Share Notes. Learn Faster. Grow Together.
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100">
            Upload, discover, bookmark, and interact with the best study
            resources in one place.
          </p>

          <Link
            to="/upload"
            className="inline-block bg-yellow-400 text-black px-7 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-300 hover:scale-105 transition"
          >
            Upload Your Resource
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-800 dark:text-white">
          🔥 Trending Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((r) => (
            <div
              key={r._id}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-200 dark:to-orange-200 p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {r.title}
              </h3>
              <p className="text-gray-700">⭐ {r.likes || 0} Likes</p>
              <p className="text-gray-700">⬇ {r.downloads || 0} Downloads</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          🤖 Recommended For You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {recommended.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              No recommendations yet
            </p>
          ) : (
            recommended.map((r) => (
              <div
                key={r._id}
                className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-xl shadow"
              >
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {r.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          📖 Latest Study Resources
        </h2>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="🔎 Search notes, subjects, resources..."
            className="w-full max-w-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white caret-black dark:caret-white placeholder-gray-400 shadow-lg p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 animate-pulse h-40 rounded-3xl"
            />
          ))
        ) : filteredResources.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No resources found 😔
          </p>
        ) : (
          filteredResources.map((r) => (
            <div
              key={r._id}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {r.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {r.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Link
                
                href={`${API_URL}/api/resources/download/${r._id}`}
          
                  to={`/preview/${r.file}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  View PDF
                </Link>


                {/* <a
  href={`${API_URL}/api/resources/download/${r._id}`}
  
  
  to={`/preview/${r.file}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
>
  View PDF
</a> */}

                <button
                  onClick={async () => {
                    await fetch(`${API_URL}/api/resources/like/${r._id}`, {
                      method: "POST"
                    });
                    window.location.reload();
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                >
                  👍 Like
                </button>

                <button
                  onClick={async () => {
                    await fetch(`${API_URL}/api/resources/bookmark/${r._id}`, {
                      method: "POST",
                      headers: {
                        Authorization: localStorage.getItem("token")
                      }
                    });
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition"
                >
                  🔖 Bookmark
                </button>

                <button
  onClick={async () => {
    setSummaryLoading((prev) => ({
      ...prev,
      [r._id]: true
    }));

    try {
      const res = await fetch(`${API_URL}/api/resources/summary/${r._id}`);
      const data = await res.json();

      setSummaries((prev) => ({
        ...prev,
        [r._id]: data.summary || "No summary available"
      }));
    } catch (error) {
      setSummaries((prev) => ({
        ...prev,
        [r._id]: "Could not generate summary"
      }));
    }

    setSummaryLoading((prev) => ({
      ...prev,
      [r._id]: false
    }));
  }}
  disabled={summaryLoading[r._id]}
  className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition disabled:opacity-50"
>
  {summaryLoading[r._id] ? "Generating..." : "🤖 Summary"}
</button>
<button
  onClick={() => {
    setEditResource(r);
    setEditTitle(r.title);
    setEditDescription(r.description);
  }}
  className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition"
>
  ✏ Edit
</button>

                <button
                  onClick={async () => {
                    await fetch(`${API_URL}/api/resources/${r._id}`, {
                      method: "DELETE"
                    });
                    window.location.reload();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                >
                  🗑 Delete
                </button>
              </div>

              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p>⬇ Downloads: {r.downloads || 0}</p>
                <p>⭐ Likes: {r.likes || 0}</p>
              </div>

              <input
                type="text"
                placeholder="Write comment..."
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white caret-black dark:caret-white p-3 w-full rounded-2xl mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    await fetch(`${API_URL}/api/resources/comment/${r._id}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        text: e.target.value
                      })
                    });
                    window.location.reload();
                  }
                }}
              />

              <div className="space-y-2">
                {r.comments &&
                  r.comments.map((c, i) => (
                    <p
                      key={i}
                      className="text-sm text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl"
                    >
                      💬 {c.text}
                    </p>
                  ))}
              </div>

             {summaryLoading[r._id] && (
  <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-4">
    <p className="text-sm text-purple-700 dark:text-purple-300">
      Generating summary...
    </p>
  </div>
)}

{!summaryLoading[r._id] && summaries[r._id] && (
  <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-4">
    <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">
      AI Summary
    </h4>
    <p className="text-sm text-gray-700 dark:text-gray-200">
      {summaries[r._id]}
    </p>
  </div>
)}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-950 dark:text-gray-100 transition-all duration-300">
      <div className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📚 Student Resource Platform
          </h1>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-gray-700 dark:text-gray-200 items-center">
            <Link
              to="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Upload
            </Link>
            <Link
              to="/login"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link to="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
  Signup
</Link>
            <Link
              to="/admin"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Admin
            </Link>
            <Link
              to="/bookmarks"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Bookmarks
            </Link>
            <Link
              to="/profile"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Profile
            </Link>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition"
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preview/:filename" element={<PdfPreview />} />
      </Routes>

      <Chatbot />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px"
          }
        }}
      />

      <footer className="bg-gradient-to-r from-gray-900 to-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <h3 className="text-2xl font-bold mb-2">
            📚 Student Resource Platform
          </h3>
          <p className="text-gray-400">
            Built for students to upload, share, and discover quality study
            resources.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>

      {editResource && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-96 shadow-xl">

      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Edit Resource
      </h2>

      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />

      <textarea
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <div className="flex justify-between">

        <button
          onClick={() => setEditResource(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await fetch(`${API_URL}/api/resources/${editResource._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token")
              },
              body: JSON.stringify({
                title: editTitle,
                description: editDescription
              })
            });

            setEditResource(null);
            window.location.reload();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;