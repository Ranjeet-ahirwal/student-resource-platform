import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL

function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessageType("error");
      setMessage("Please login first");
      return;
    }

    if (!file) {
      setMessageType("error");
      setMessage("Please select a file");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/resources/upload`, {
        method: "POST",
        headers: {
          Authorization: token
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage(data.message || "Upload complete ✅");
        setTitle("");
        setDescription("");
        setFile(null);

        const fileInput = document.getElementById("upload-file-input");
        if (fileInput) fileInput.value = "";
      } else {
        setMessageType("error");
        setMessage(data.message || data.error || "Upload failed");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">
          Upload Resource 📚
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Share your notes, PDFs, and study material with other students
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm font-medium ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter resource title"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white caret-black dark:caret-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Write a short description"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white caret-black dark:caret-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Choose File
            </label>
            <div
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  }}
  className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
>
  {file ? (
    <p className="text-green-600 font-semibold">
      📄 {file.name}
    </p>
  ) : (
    <p className="text-gray-500">
      Drag & drop PDF here or click below
    </p>
  )}

  <input
    type="file"
    className="mt-4"
    onChange={(e) => setFile(e.target.files[0])}
  />
</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;