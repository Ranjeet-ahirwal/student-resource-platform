import { Link, useLocation } from "react-router-dom";

function DashboardLayout({ title, children }) {
  const location = useLocation();

  const linkClass = (path) =>
    `block w-full px-4 py-3 rounded-xl transition font-medium ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
          
          <aside className="relative z-20 pointer-events-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Dashboard
            </h2>

            <div className="flex flex-col gap-3">
              <Link to="/" className={linkClass("/")}>🏠 Home</Link>
              <Link to="/upload" className={linkClass("/upload")}>⬆ Upload</Link>
              <Link to="/profile" className={linkClass("/profile")}>👤 Profile</Link>
              <Link to="/bookmarks" className={linkClass("/bookmarks")}>🔖 Bookmarks</Link>
              <Link to="/admin" className={linkClass("/admin")}>🛠 Admin</Link>
            </div>
          </aside>

          <main className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 min-w-0">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {title}
            </h1>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;